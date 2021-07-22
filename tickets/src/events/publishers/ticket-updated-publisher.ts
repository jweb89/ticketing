import { Publisher, Subjects, TicketUpdatedEvent } from '@jbwtickets/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}
