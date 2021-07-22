import request from 'supertest'
import { app } from '../../app'
import mongoose, { mongo } from 'mongoose'
import { Order, OrderStatus } from '../../models/order'
import { Ticket } from '../../models/ticket'

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  })

  await ticket.save()
  return ticket
}

it('fetches order for a user', async () => {
  // Create three tickets
  const ticketOne = await buildTicket()
  const ticketTwo = await buildTicket()
  const ticketThree = await buildTicket()

  const userOne = global.signin()
  const userTwo = global.signin()

  // Create one order as user 1
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketOne.id })
    .expect(201)

  // Create 2 orders as user 2
  const { body: OrderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201)
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketThree.id })
    .expect(201)

  // Make request to get ordres for user 2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200)

  // Make sure we only got the orders for user #2
  expect(response.body.length).toEqual(2)
  expect(response.body[0].id).toEqual(orderOne.id)
  expect(response.body[1].id).toEqual(OrderTwo.id)
  expect(response.body[0].ticket.id).toEqual(ticketOne.id)
  expect(response.body[1].ticket.id).toEqual(ticketTwo.id)
})
