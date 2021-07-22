import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { Order } from '../../models/order'
import { OrderStatus } from '@jbwtickets/common'
import { stripe } from '../../stripe'
import { Payment } from '../../models/payment'

jest.mock('../../stripe.ts')

it('returns 404 when purchasing an order that does not exists', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'adafd',
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404)
})
it('return a 401 when purchasing an order that doesnt belond to order', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  })

  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'adafd',
      orderId: order.id,
    })
    .expect(401)
})
it('returns 400 when purchasing a cancelled order', async () => {
  const userId = mongoose.Types.ObjectId().toHexString()

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({ orderId: order.id, token: 'dafda' })
    .expect(400)
})

it('returns a 204 with valid inputs', async () => {
  const userId = mongoose.Types.ObjectId().toHexString()

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({ orderId: order.id, token: 'tok_visa' })
    .expect(201)

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]

  expect(chargeOptions.source).toEqual('tok_visa')
  expect(chargeOptions.amount).toEqual(20 * 100)
  expect(chargeOptions.currency).toEqual('usd')

  const payment = await Payment.findOne({
    orderId: order.id,
  })

  expect(payment).not.toBeNull()
})
