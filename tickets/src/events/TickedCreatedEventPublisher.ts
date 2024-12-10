import {
  Publisher,
  SubscriptionTypes,
  EventTicketCreated,
} from "@docentav/common";

export class TickedCreatedEventPublisher extends Publisher<EventTicketCreated> {
  subscription = SubscriptionTypes.TicketCreated;
}
