import {
  Publisher,
  SubscriptionTypes,
  OrderCancelledEvent,
} from "@docentav/common";

export class OrderCancelledEventPublisher extends Publisher<OrderCancelledEvent> {
  subscription = SubscriptionTypes.OrderCancelled;
}
