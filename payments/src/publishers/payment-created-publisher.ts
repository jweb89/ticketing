import { PaymentCreatedEvent, Publisher, Subjects } from '@jbwtickets/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}
