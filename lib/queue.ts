import { Construct } from 'constructs'
import { Duration } from 'aws-cdk-lib'
import { IFunction } from 'aws-cdk-lib/aws-lambda'
import { IQueue, Queue } from 'aws-cdk-lib/aws-sqs'
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources'

interface QueueConstructProps {
  consumer: IFunction
}

export class QueueConstruct extends Construct {
  public readonly orderQueue: IQueue

  constructor(scope: Construct, id: string, props: QueueConstructProps) {
    super(scope, id)

    this.orderQueue = this.createOrderQueue(props.consumer)
  }

  private createOrderQueue(consumer: IFunction) {
    const orderQueue = new Queue(this, 'OrderQueue', {
      queueName: 'OrderQueue',
      visibilityTimeout: Duration.seconds(30)
    })

    consumer.addEventSource(new SqsEventSource(orderQueue, { batchSize: 1 }))

    return orderQueue
  }
}
