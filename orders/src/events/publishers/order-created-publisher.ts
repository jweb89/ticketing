import { Publisher, OrderCreatedEvent, Subjects } from '@jbwtickets/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
}
