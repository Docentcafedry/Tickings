import {
  Publisher,
  SubscriptionTypes,
  EventChargeCreated,
} from "@docentav/common";

export class ChargeCreatedEventPublisher extends Publisher<EventChargeCreated> {
  subscription = SubscriptionTypes.ChargeCreated;
}
