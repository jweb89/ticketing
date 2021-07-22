import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@jbwtickets/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}
