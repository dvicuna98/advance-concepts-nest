import { Injectable } from '@nestjs/common';
import { PaymentFailedEvent } from './events/payment-failed.event';
import { OnEvent } from '@nestjs/event-emitter';
import { EventContext } from './context/events-context';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class SubscriptionsService {

  constructor(private readonly moduleRef: ModuleRef) {
  }
  @OnEvent(PaymentFailedEvent.key)
  async cancelSubscription(event:PaymentFailedEvent){
    const eventContext = await this.moduleRef.resolve(
      EventContext,
      event.meta.contextId
    )
    console.log('Cancelling subscription', eventContext.request.url)
  }
}
