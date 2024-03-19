import { QueryCommand, ScanCommand, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { ddbClient } from './ddbClient'

const ORDER_TABLE_NAME = process.env.ORDER_TABLE_NAME

export class OrderSerivce {
  async getAll() {
    const scanCommandInput = {
      TableName: ORDER_TABLE_NAME
    }

    const { Count, Items } = await ddbClient.send(new ScanCommand(scanCommandInput))

    return {
      count: Count,
      results: Items.map(item => unmarshall(item))
    }
  }

  async getByUserName(userName, orderDate) {
    let filter = {
      KeyConditionExpression: '#userName = :userName',
      ExpressionAttributeNames: { '#userName': 'userName' },
      ExpressionAttributeValues: { ':userName': { S: userName } }
    }

    if (orderDate) {
      filter = {
        KeyConditionExpression: '#userName = :userName AND begins_with(#orderDate, :orderDate)',
        ExpressionAttributeNames: {
          ...filter.ExpressionAttributeNames,
          '#orderDate': 'orderDate'
        },
        ExpressionAttributeValues: {
          ...filter.ExpressionAttributeValues,
          ':orderDate': { S: orderDate }
        }
      }
    }

    const queryCommandInput = {
      TableName: ORDER_TABLE_NAME,
      ...filter
    }

    const { Count, Items } = await ddbClient.send(new QueryCommand(queryCommandInput))

    return {
      count: Count,
      results: Items.map(item => unmarshall(item))
    }
  }

  async create(createOrderInput) {
    createOrderInput.orderDate = (new Date()).toISOString()

    const putCommandInput = {
      TableName: ORDER_TABLE_NAME,
      Item: marshall(createOrderInput)
    }

    const putItemOutput = await ddbClient.send(new PutItemCommand(putCommandInput))

    return {
      response: putItemOutput,
      userName: createOrderInput.userName
    }
  }
}
