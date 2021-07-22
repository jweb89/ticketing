import { TicketCreatedListener } from '../ticket-created-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { TicketCreatedEvent } from '@jbwtickets/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
  // instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client)

  // create fake data event
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  }
  // fake message obj
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg }
}

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup()

  // call onmesasge with data + message
  await listener.onMessage(data, msg)

  //write assertions to make sure a ticket created
  const ticket = await Ticket.findById(data.id)

  expect(ticket).toBeDefined()
  expect(ticket?.title).toEqual(data.title)
  expect(ticket?.price).toEqual(data.price)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()

  // call onmesasge with data + message
  await listener.onMessage(data, msg)
  //make sure ack is called
  expect(msg.ack).toHaveBeenCalled()
})