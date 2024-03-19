import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { DatabaseConstruct } from './database'
import { MicroservicesConstruct } from './microservice'
import { ApiGatewayConstruct } from './apigateway'
import { QueueConstruct } from './queue'
import { EventBusConstruct } from './eventbus'

export class AwsMicroservicesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const database = new DatabaseConstruct(this, 'AwsMicroservicesDatabase')

    const microservices = new MicroservicesConstruct(this, 'AwsMicroservicesLambda', {
      productTable: database.productTable,
      basketTable: database.basketTable,
      orderTable: database.orderTable
    })

    new ApiGatewayConstruct(this, 'AwsMicroservicesApiGateway', {
      productMicroservice: microservices.productMicroservice,
      basketMicroservice: microservices.basketMicroservice,
      orderMicroservice: microservices.orderMicroservice
    })

    const queues = new QueueConstruct(this, 'AwsMicroservicesQueue', {
      consumer: microservices.orderMicroservice
    })

    new EventBusConstruct(this, 'AwsMicroservicesEventBus', {
      publisherFunction: microservices.basketMicroservice,
      targetQueue: queues.orderQueue
    })
  }
}
