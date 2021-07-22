import { TicketUpdatedListener } from '../ticket-updated-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { TicketUpdatedEvent } from '@jbwtickets/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
  // instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client)

  // create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    title: 'concert',
  })

  await ticket.save()

  // create fake data object
  const data: TicketUpdatedEvent['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: 'new concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  }
  // fake message obj
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg, ticket }
}

it('finds, updates, and saves a ticket', async () => {
  const { listener, data, msg } = await setup()

  // call onmesasge with data + message
  await listener.onMessage(data, msg)

  //write assertions to make sure a ticket created
  const updatedTicket = await Ticket.findById(data.id)

  expect(updatedTicket?.title).toEqual(data.title)
  expect(updatedTicket?.price).toEqual(data.price)
  expect(updatedTicket?.version).toEqual(data.version)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()

  // call onmesasge with data + message
  await listener.onMessage(data, msg)
  //make sure ack is called
  expect(msg.ack).toHaveBeenCalled()
})

it('does not call ack if the event has a skipped version number', async () => {
  const { msg, data, listener, ticket } = await setup()
  data.version = 10

  try {
    await listener.onMessage(data, msg)
  } catch (e) {}

  expect(msg.ack).not.toHaveBeenCalled()
})
