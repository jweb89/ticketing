import { Listener, OrderCreatedEvent, Subjects } from '@jbwtickets/common'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/ticket'
import { queueGroupName } from './queue-group-name'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
  queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    //Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id)

    // if no ticket throw error
    if (!ticket) {
      throw new Error('Ticket not found')
    }
    // Mark the ticket as being reserved by setting ordre id
    ticket.set({ orderId: data.id })
    // save the ticket
    await ticket.save()
    new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      orderId: ticket?.orderId,
      version: ticket.version,
      userId: ticket.userId,
    })

    // ack the message
    msg.ack()
  }
}
