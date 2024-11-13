import { SUCCESS_RESPONSE, response200, response201, response404 } from '../constants'
import { productService } from './product.service'

export class ProductHandler {
  async getAll(getAllInput) {
    const getAllOutput = await productService.getAll(getAllInput)

    return response200(getAllOutput)
  }

  async getSingle(productId) {
    const product = await productService.getById(productId)

    if (!product) {
      return response404()
    }

    return response200(product)
  }

  async create(createProductInput) {
    const { productId } = await productService.create(createProductInput)

    const product = await productService.getById(productId)

    return response201(product)
  }

  async update(productId, updateProductInput) {
    const product = await productService.getById(productId)

    if (!product) {
      return response404()
    }

    await productService.updateById(productId, updateProductInput)

    return response200({
      ...product,
      ...updateProductInput
    })
  }

  async delete(productId) {
    await productService.deleteById(productId)

    return response200(SUCCESS_RESPONSE)
  }
}

export const productHandler = new ProductHandler()
