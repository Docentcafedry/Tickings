import {
  Publisher,
  SubscriptionTypes,
  EventTicketUpdated,
} from "@docentav/common";

export class TickedUpdatedEventPublisher extends Publisher<EventTicketUpdated> {
  subscription = SubscriptionTypes.TicketUpdated;
}
