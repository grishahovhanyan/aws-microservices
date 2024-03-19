import { GetItemCommand, ScanCommand, PutItemCommand, UpdateItemCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { v4 as uuidv4 } from 'uuid'
import { ddbClient } from './ddbClient'

const PRODUCT_TABLE_NAME = process.env.PRODUCT_TABLE_NAME

export class ProductService {
  async getAll(getAllInput) {
    const filter = {
      FilterExpression: '#category = :category',
      ExpressionAttributeNames: { '#category': 'category' },
      ExpressionAttributeValues: { ':category': { S: getAllInput?.category } }
    }

    const scanCommandInput = {
      TableName: PRODUCT_TABLE_NAME,
      ...(getAllInput?.category ? filter : {})
    }

    const { Count, Items } = await ddbClient.send(new ScanCommand(scanCommandInput))
    console.log(Items, '<=====items get all')
    return {
      count: Count,
      results: Items.map(item => unmarshall(item))
    }
  }

  async getByIds(productIds) {
    const scanCommandInput = {
      TableName: PRODUCT_TABLE_NAME,
      FilterExpression: 'contains(:productIds, #productId)',
      ExpressionAttributeNames: { '#productId': 'id' },
      ExpressionAttributeValues: marshall({ ':productIds': productIds })
    }
    console.log(marshall({ ':productIds': productIds }))
    const { Count, Items } = await ddbClient.send(new ScanCommand(scanCommandInput))

    console.log(Items, '<===items')
    return {
      count: Count,
      results: Items.map(item => unmarshall(item))
    }
  }

  async getById(productId) {
    const getCommandInput = {
      TableName: PRODUCT_TABLE_NAME,
      Key: marshall({ id: productId })
    }

    const { Item: product } = await ddbClient.send(new GetItemCommand(getCommandInput))

    return product ? unmarshall(product) : null
  }

  async create(createProductInput) {
    createProductInput.id = uuidv4()

    const putCommandInput = {
      TableName: PRODUCT_TABLE_NAME,
      Item: marshall(createProductInput)
    }

    const putItemOutput = await ddbClient.send(new PutItemCommand(putCommandInput))

    return {
      response: putItemOutput,
      productId: createProductInput.id
    }
  }

  async updateById(productId, updateProductInput) {
    const inputKeys = Object.keys(updateProductInput)

    const updateCommandInput = {
      TableName: PRODUCT_TABLE_NAME,
      Key: marshall({ id: productId }),
      UpdateExpression: `SET ${inputKeys.map((_, index) => `#key${index} = :value${index}`).join(", ")}`,
      ExpressionAttributeNames: inputKeys.reduce((acc, key, index) => ({
        ...acc,
        [`#key${index}`]: key,
      }), {}),
      ExpressionAttributeValues: marshall(inputKeys.reduce((acc, key, index) => ({
        ...acc,
        [`:value${index}`]: updateProductInput[key],
      }), {})),
    }

    return await ddbClient.send(new UpdateItemCommand(updateCommandInput))
  }

  async deleteById(productId) {
    const deleteCommandInput = {
      TableName: PRODUCT_TABLE_NAME,
      Key: marshall({ id: productId })
    }

    return await ddbClient.send(new DeleteItemCommand(deleteCommandInput))
  }
}
