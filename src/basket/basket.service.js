import { GetItemCommand, ScanCommand, PutItemCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { PutEventsCommand } from '@aws-sdk/client-eventbridge'
import { ddbClient } from './ddbClient'
import { ebClient } from './eventBridgeClient'

const BASKET_TABLE_NAME = process.env.BASKET_TABLE_NAME

export class BasketService {
  async getAll() {
    const scanCommandInput = {
      TableName: BASKET_TABLE_NAME
    }

    const { Count, Items } = await ddbClient.send(new ScanCommand(scanCommandInput))

    return {
      count: Count,
      results: Items.map(item => unmarshall(item))
    }
  }

  async getByUserName(userName) {
    const getCommandInput = {
      TableName: BASKET_TABLE_NAME,
      Key: marshall({ userName })
    }

    const { Item: basket } = await ddbClient.send(new GetItemCommand(getCommandInput))

    return basket ? unmarshall(basket) : null
  }

  async create(createBasketInput) {
    const putCommandInput = {
      TableName: BASKET_TABLE_NAME,
      Item: marshall(createBasketInput)
    }

    const putItemOutput = await ddbClient.send(new PutItemCommand(putCommandInput))

    return {
      response: putItemOutput,
      userName: createBasketInput.userName
    }
  }

  async delete(userName) {
    const deleteCommandInput = {
      TableName: BASKET_TABLE_NAME,
      Key: marshall({ userName })
    }

    return await ddbClient.send(new DeleteItemCommand(deleteCommandInput))
  }

  async checkout(checkoutPaylod) {
    const putEventsCommandInput = {
      Entries: [
        {
          EventBusName: process.env.BASKET_EVENT_BUS_NAME,
          Source: process.env.CHECKOUT_EVENT_SOURCE,
          DetailType: process.env.CHECKOUT_EVENT_DETAIL_TYPE,
          Detail: JSON.stringify(checkoutPaylod)
        }
      ]
    }
    return await ebClient.send(new PutEventsCommand(putEventsCommandInput))
  }

  prepareCheckoutPaylod(checkoutBasketInput, basket) {
    const checkoutPaylod = {
      ...checkoutBasketInput,
      ...basket
    }

    checkoutPaylod.totalPrice = basket.items.reduce((a, b) => a + (b.quantity * b.price), 0)

    return checkoutPaylod
  }
}