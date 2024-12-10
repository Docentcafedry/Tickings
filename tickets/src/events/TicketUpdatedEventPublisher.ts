import {
  Publisher,
  SubscriptionTypes,
  EventTicketCreated,
} from "@docentav/common";

export class TickedUpdatedEventPublisher extends Publisher<EventTicketCreated> {
  subscription = SubscriptionTypes.TicketUpdated;
}
