import { Publisher, Subjects, TicketCreatedEvent } from '@jbwtickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}
