import { Publisher, OrderCancelledEvent, Subjects } from '@jbwtickets/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}
