import { HTTP_METHODS, HTTP_STATUS_CODES, httpResponse } from '../constants'

import { BasketHandler } from './basket.handler'

const basketHandler = new BasketHandler()

exports.handler = async (event) => {
  console.log(`Basket Microservice. Request URL: ${event.path}`)


  try {
    // { statusCode: number, body: Object }
    let response = {}

    const userName = event.pathParameters?.userName
    const requestBody = JSON.parse(event.body)

    switch (event.httpMethod) {
      case HTTP_METHODS.GET:
        if (userName) {
          response = await basketHandler.getSingle(userName)
        } else {
          response = await basketHandler.getAll()
        }
        break
      case HTTP_METHODS.POST:
        if (userName) {
          response = await basketHandler.checkout(userName, requestBody)
        } else {
          response = await basketHandler.create(requestBody)
        }
        break
      case HTTP_METHODS.DELETE:
        response = await basketHandler.delete(userName)
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