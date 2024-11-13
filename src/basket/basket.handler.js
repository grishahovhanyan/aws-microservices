import { SUCCESS_RESPONSE, response200, response201, response404 } from '../constants'
import { productService } from '../product/product.service'
import { basketService } from './basket.service'

export class BasketHandler {
  async getAll() {
    const getAllOutput = await basketService.getAll()

    return response200(getAllOutput)
  }

  async getSingle(userName) {
    const basket = await basketService.getByUserName(userName)

    if (!basket) {
      return response404()
    }

    return response200(basket)
  }

  async create(createBasketInput) {
    /**
     * createBasketInput = {
     *    userName: aws,
     *    items: [
     *        {
     *            productId: '368b0515-23df-416c-8bf8-f34aeaa63ddf',
     *            quantity: 1,
     *            color: 'Red'
     *        }
     *    ]
     * }
     */
    const productIds = createBasketInput.items.map(item => item.productId)

    const { results: products } = await productService.getByIds(productIds)
    if (productIds.length !== products.length) {
      return response404()
    }

    createBasketInput.items = createBasketInput.items.map(item => {
      const dbProduct = products.find(product => product.id === item.productId)

      item.productName = dbProduct.name
      item.price = dbProduct.price

      return item
    })

    /**
     * createBasketInput = {
     *    userName: aws,
     *    items: [
     *        {
     *            productId: '368b0515-23df-416c-8bf8-f34aeaa63ddf',
     *            quantity: 1,
     *            color: 'Red',
     *            productName: 'Iphone X',
     *            price: 1000
     *        }
     *    ]
     * }
     */
    const { userName } = await basketService.create(createBasketInput)

    const basket = await basketService.getByUserName(userName)

    return response201(basket)
  }

  async delete(userName) {
    await basketService.delete(userName)

    return response201(SUCCESS_RESPONSE)
  }

  async checkout(userName, checkoutBasketInput) {
    const basket = await basketService.getByUserName(userName)

    if (!basket || basket.items?.length === 0) {
      return response404()
    }

    const checkoutPaylod = basketService.prepareCheckoutPaylod(checkoutBasketInput, basket)
    await basketService.checkout(checkoutPaylod)
    await basketService.delete(userName)

    return response200(checkoutPaylod)
  }
}

export const basketHandler = new BasketHandler()
