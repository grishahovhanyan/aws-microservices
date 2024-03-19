import { HTTP_METHODS, HTTP_STATUS_CODES, httpResponse } from '../constants'

import { ProductHandler } from './product.handler'

const productHandler = new ProductHandler()

exports.handler = async (event) => {
  console.log(`Product Microservice. Request URL: ${event.path}`)

  try {
    // { statusCode: number, body: Object }
    let response = {}

    const productId = event.pathParameters?.id
    const requestBody = JSON.parse(event.body)

    switch (event.httpMethod) {
      case HTTP_METHODS.GET:
        if (productId) {
          response = await productHandler.getSingle(productId)
        } else {
          response = await productHandler.getAll(event.queryStringParameters)
        }
        break
      case HTTP_METHODS.POST:
        response = await productHandler.create(requestBody)
        break
      case HTTP_METHODS.PUT:
        response = await productHandler.update(productId, requestBody)
        break
      case HTTP_METHODS.DELETE:
        response = await productHandler.delete(productId)
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