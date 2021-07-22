import { Ticket } from '../../../models/ticket'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCancelledListener } from '../order-cancelled-listener'
import mongoose from 'mongoose'
import { OrderCancelledEvent } from '@jbwtickets/common'
import { Message } from 'node-nats-streaming'

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)
  const orderId = mongoose.Types.ObjectId().toHexString()
  const ticket = Ticket.build({
    title: 'fadf',
    price: 20,
    userId: 'fda',
  })

  ticket.set({ orderId })
  await ticket.save()

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg, ticket, orderId }
}

it('updated the ticket publishes an event acks the message', async () => {
  const { msg, data, ticket, orderId, listener } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket?.orderId).not.toBeDefined
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
