import {
  Publisher,
  SubscriptionTypes,
  ExpiratonCompleteEvent,
} from "@docentav/common";

export class ExpirationOrderEventPublisher extends Publisher<ExpiratonCompleteEvent> {
  subscription = SubscriptionTypes.ExoirationComplete;
}
