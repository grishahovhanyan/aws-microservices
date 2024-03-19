import { Construct } from 'constructs'
import { EventBus, IEventBus, Rule } from 'aws-cdk-lib/aws-events'
import { SqsQueue } from 'aws-cdk-lib/aws-events-targets'
import { IFunction } from 'aws-cdk-lib/aws-lambda'
import { IQueue } from 'aws-cdk-lib/aws-sqs'

interface EventBusConstructProps {
  publisherFunction: IFunction
  targetQueue: IQueue
}

export class EventBusConstruct extends Construct {
  public readonly basketBus: IEventBus

  constructor(scope: Construct, id: string, props: EventBusConstructProps) {
    super(scope, id)

    this.basketBus = this.createBasketBus(props.publisherFunction, props.targetQueue)
  }

  private createBasketBus(publisherFunction: IFunction, targetQueue: IQueue) {
    const basketBus = new EventBus(this, 'BasketBus', {
      eventBusName: 'BasketBus'
    })

    const checkoutBasketRule = new Rule(this, 'CheckoutBasketRule', {
      eventBus: basketBus,
      enabled: true,
      description: 'When Basket microservice checkout the basket',
      ruleName: 'CheckoutBasketRule',
      eventPattern: {
        source: ['src.basket.checkout'],
        detailType: ['CheckoutBasket']
      }
    })

    basketBus.grantPutEventsTo(publisherFunction)
    checkoutBasketRule.addTarget(new SqsQueue(targetQueue))

    return basketBus
  }
}
