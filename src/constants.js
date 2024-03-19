export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
}

export const HTTP_STATUS_CODES = {
  success200: 200,
  created201: 201,
  noContent204: 204,
  badRequest400: 400,
  unauthorized401: 401,
  forbidden403: 403,
  notFound404: 404,
  conflict409: 409,
  internalServerError500: 500,
  notImplemented501: 501
}

export const SUCCESS_RESPONSE = { message: 'success' }

export const httpResponse = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
})

export const response200 = (body) => ({
  statusCode: HTTP_STATUS_CODES.success200,
  body
})

export const response201 = (body) => ({
  statusCode: HTTP_STATUS_CODES.created201,
  body
})

export const response404 = () => ({
  statusCode: HTTP_STATUS_CODES.notFound404,
  body: { detail: 'Not found.' }
})
