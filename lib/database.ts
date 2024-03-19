import { Construct } from 'constructs'
import { AttributeType, BillingMode, ITable, Table } from 'aws-cdk-lib/aws-dynamodb'
import { RemovalPolicy } from 'aws-cdk-lib'

export class DatabaseConstruct extends Construct {
  public readonly productTable: ITable
  public readonly basketTable: ITable
  public readonly orderTable: ITable

  constructor(scope: Construct, id: string) {
    super(scope, id)

    this.productTable = this.createProductTable()
    this.basketTable = this.createBasketTable()
    this.orderTable = this.createOrderTable()
  }

  private createProductTable() {
    return new Table(this, 'ProductTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      tableName: 'products',
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY
    })
  }

  private createBasketTable() {
    return new Table(this, 'BasketTable', {
      partitionKey: { name: 'userName', type: AttributeType.STRING },
      tableName: 'baskets',
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY
    })
  }

  private createOrderTable() {
    return new Table(this, 'OrderTable', {
      partitionKey: {
        name: 'userName',
        type: AttributeType.STRING
      },
      sortKey: {
        name: 'orderDate',
        type: AttributeType.STRING
      },
      tableName: 'orders',
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY
    })
  }
}
