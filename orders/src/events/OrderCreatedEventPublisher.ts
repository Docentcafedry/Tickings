import {
  Publisher,
  OrderCreatedEvent,
  SubscriptionTypes,
} from "@docentav/common";

export class OrderCreatedEventPublisher extends Publisher<OrderCreatedEvent> {
  subscription = SubscriptionTypes.OrderCreated;
}
