import { Construct } from 'constructs'
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Runtime } from 'aws-cdk-lib/aws-lambda'
import { ITable } from 'aws-cdk-lib/aws-dynamodb'
import { join } from 'path'

interface MicroservicesConstructProps {
  productTable: ITable
  basketTable: ITable
  orderTable: ITable
}

export class MicroservicesConstruct extends Construct {
  public readonly productMicroservice: NodejsFunction
  public readonly basketMicroservice: NodejsFunction
  public readonly orderMicroservice: NodejsFunction

  constructor(scope: Construct, id: string, props: MicroservicesConstructProps) {
    super(scope, id)

    this.productMicroservice = this.createProductFunction(props.productTable)
    this.basketMicroservice = this.createBasketFunction(props.basketTable, props.productTable)
    this.orderMicroservice = this.createOrderFunction(props.orderTable)
  }

  private createProductFunction(productTable: ITable): NodejsFunction {
    const productFunctionProps: NodejsFunctionProps = {
      functionName: 'ProductLambdaFunction',
      bundling: {
        externalModules: ['aws-sdk']
      },
      environment: {
        PRODUCT_TABLE_NAME: productTable.tableName
      },
      runtime: Runtime.NODEJS_20_X
    }

    const productFunction = new NodejsFunction(this, 'ProductLambda', {
      entry: join(__dirname, '..', 'src', 'product', 'index.js'),
      ...productFunctionProps
    })

    productTable.grantReadWriteData(productFunction)

    return productFunction
  }

  private createBasketFunction(basketTable: ITable, productTable: ITable): NodejsFunction {
    const basketFunctionProps: NodejsFunctionProps = {
      functionName: 'BasketLambdaFunction',
      bundling: {
        externalModules: ['aws-sdk']
      },
      environment: {
        BASKET_TABLE_NAME: basketTable.tableName,
        PRODUCT_TABLE_NAME: productTable.tableName,
        BASKET_EVENT_BUS_NAME: 'BasketBus',
        CHECKOUT_EVENT_SOURCE: 'src.basket.checkout',
        CHECKOUT_EVENT_DETAIL_TYPE: 'CheckoutBasket'
      },
      runtime: Runtime.NODEJS_20_X
    }

    const basketFunction = new NodejsFunction(this, 'BasketLambda', {
      entry: join(__dirname, '..', 'src', 'basket', 'index.js'),
      ...basketFunctionProps
    })

    basketTable.grantReadWriteData(basketFunction)
    productTable.grantReadData(basketFunction)

    return basketFunction
  }

  createOrderFunction(orderTable: ITable) {
    const orderFunctionProps: NodejsFunctionProps = {
      functionName: 'OrderLambdaFunction',
      bundling: {
        externalModules: ['aws-sdk']
      },
      environment: {
        ORDER_TABLE_NAME: orderTable.tableName
      },
      runtime: Runtime.NODEJS_20_X
    }

    const orderFunction = new NodejsFunction(this, 'OrderLambda', {
      entry: join(__dirname, '..', 'src', 'order', 'index.js'),
      ...orderFunctionProps
    })

    orderTable.grantReadWriteData(orderFunction)

    return orderFunction
  }
}
