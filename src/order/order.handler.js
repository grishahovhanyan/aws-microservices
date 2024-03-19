import { response200, response201, response404 } from '../constants'

import { OrderSerivce } from './order.service'

const orderService = new OrderSerivce()

export class OrderHandler {
  async getAll() {
    const getAllOutput = await orderService.getAll()

    return response200(getAllOutput)
  }

  async getByUserName(userName, orderDate) {
    const getAllByUserNameOutput = await orderService.getByUserName(userName, orderDate)

    return response200(getAllByUserNameOutput)
  }

  async create(createOrderInput) {
    const { userName } = await orderService.create(createOrderInput)

    const order = await orderService.getByUserName(userName)

    return response201(order)
  }
}
