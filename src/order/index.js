import { HTTP_METHODS, HTTP_STATUS_CODES, httpResponse } from '../constants'

import { orderHandler } from './order.handler'

export async function handler(event) {
  if (event.Records) {
    await sqsInvocation(event)
  } else if (event['detail-type']) {
    await eventBridgeInvocation(event)
  } else {
    return await apiGatewayInvocation(event)
  }
}

const sqsInvocation = async (event) => {
  console.log('SQS Invocation:', event)

  for (let i = 0; i < event.Records.length; i++) {
    const record = event.Records[i]

    // Expected request: { detail-type': 'CheckoutBasket', 'source': 'src.basket.checkout', 'detail': { 'userName': 'aws', 'totalPrice': 1820, ... }, ... }
    const checkoutEventPaylod = JSON.parse(record.body)

    await orderHandler.create(checkoutEventPaylod.detail)
  }
}

const eventBridgeInvocation = async (event) => {
  // This won't work because we have connected SQS
  console.log('EventBride Invocation:', event)

  return await orderHandler.create(event.detail)
}

const apiGatewayInvocation = async (event) => {
  console.log(`Order Microservice. Request URL: ${event.path}`)

  try {
    // { statusCode: number, body: Object }
    let response = {}

    const userName = event.pathParameters?.userName

    switch (event.httpMethod) {
      case HTTP_METHODS.GET:
        if (userName) {
          response = await orderHandler.getByUserName(userName, event.queryStringParameters?.orderDate)
        } else {
          response = await orderHandler.getAll()
        }
        break
      default:
        response = {
          statusCode: HTTP_STATUS_CODES.notImplemented501,
          body: { detail: `Not Implemented: ${event.path}` }
        }
    }

    return httpResponse(response.statusCode, response.body)
  } catch (e) {
    console.log('Error:', e)
    return httpResponse(HTTP_STATUS_CODES.internalServerError500, { errorMessage: e.message })
  }
}
