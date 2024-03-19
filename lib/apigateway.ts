import { Construct } from 'constructs'
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'

interface ApiGatewayConstructProps {
  productMicroservice: NodejsFunction
  basketMicroservice: NodejsFunction
  orderMicroservice: NodejsFunction
}

const STAGE_NAME = 'dev'

export class ApiGatewayConstruct extends Construct {
  constructor(scope: Construct, id: string, props: ApiGatewayConstructProps) {
    super(scope, id)

    this.createProductApi(props.productMicroservice)
    this.createBasketApi(props.basketMicroservice)
    this.createOrderApi(props.orderMicroservice)
  }

  private createProductApi(productMicroservice: NodejsFunction) {
    const productApi = new LambdaRestApi(this, 'ProductApi', {
      handler: productMicroservice,
      restApiName: 'Product Api',
      proxy: false,
      deployOptions: { stageName: STAGE_NAME }
    })

    const products = productApi.root.addResource('products')
    products.addMethod('GET') // GET /products | ?category=phone
    products.addMethod('POST') // POSt /products

    const singleProduct = products.addResource('{id}')
    singleProduct.addMethod('GET') // GET /products/{id}
    singleProduct.addMethod('PUT') // PUT /products/{id}
    singleProduct.addMethod('DELETE') // DELETE /products/{id}
  }

  private createBasketApi(basketMicroservice: NodejsFunction) {
    const basketApi = new LambdaRestApi(this, 'BasketApi', {
      handler: basketMicroservice,
      restApiName: 'Basket Api',
      proxy: false,
      deployOptions: { stageName: STAGE_NAME }
    })

    const baskets = basketApi.root.addResource('baskets')
    baskets.addMethod('GET') // GET /baskets
    baskets.addMethod('POST') // POST /baskets

    const singleBasket = baskets.addResource('{userName}')
    singleBasket.addMethod('GET') // GET /baskets/{userName}
    singleBasket.addMethod('DELETE') // DELETE /baskets/{userName}

    const checkoutBasket = singleBasket.addResource('checkout')
    checkoutBasket.addMethod('POST') // POSt /baskets/{userName}/checkout
  }

  private createOrderApi(orderMicroservice: NodejsFunction) {
    const orderApi = new LambdaRestApi(this, 'OrderApi', {
      handler: orderMicroservice,
      restApiName: 'Order Api',
      proxy: false,
      deployOptions: { stageName: STAGE_NAME }
    })

    const orders = orderApi.root.addResource('orders')
    orders.addMethod('GET') // GET /orders

    const singleOrder = orders.addResource('{userName}')
    singleOrder.addMethod('GET') // GET /orders/{userName} | ?orderDate=1970-01-01T00:00:00
  }
}
