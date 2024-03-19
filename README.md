# Serverless Event-driven E-commerce Microservices

![course2](https://user-images.githubusercontent.com/1147445/158019166-96732203-6642-4242-b1d9-d53ece2e1ed3.png)

This is a Serverless Event-driven E-commerce project for TypeScript development with CDK.

## Whats Including In This Repository

We will be following the reference architecture above which is a real-world **Serverless E-commerce application** and it includes;

- **REST API** and **CRUD** endpoints with using **AWS Lambda, API Gateway**
- **Data persistence** with using **AWS DynamoDB**
- **Decouple microservices** with events using **Amazon EventBridge**
- **Message Queues** for cross-service communication using **AWS SQS**
- **Cloud stack development** with **IaC** using **AWS CloudFormation and AWS CDK**

## Prerequisites

You will need the following tools:

- AWS Account and User
- AWS CLI
- NodeJS
- AWS CDK Toolkit
- Docker

### Run The Project

Follow these steps to get your development environment set up:

1. To set up the AWS CLI, run the following command:

```
aws configure
```

2. Clone the repository

3. At the root directory which include **cdk.json** files, run the following command:

```
cdk deploy
```

> Note: Make sure that your Docker is running before execute the cdk deploy command.

4. Wait for provision all microservices into aws cloud. That’s it!

5. You can **launch microservices** as below urls:

- **Products API -> https://xxx.execute-api.ap-southeast-1.amazonaws.com/{stage}/products**
- **Baskets API -> https://xxx.execute-api.ap-southeast-1.amazonaws.com/{stage}/baskets**
- **Orders API -> https://xxx.execute-api.ap-southeast-1.amazonaws.com/{stage}/orders**

6. Copy the postman collection from the **/postman** folder

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `cdk synth` emits the synthesized CloudFormation template
- `cdk diff` compare deployed stack with current state
- `cdk deploy` deploy this stack to your default AWS account/region

## Author

- **Grisha Hovhanyan** - [github:grishahovhanyan](https://github.com/grishahovhanyan)

> [Udemy](https://www.udemy.com/course/aws-serverless-microservices-lambda-eventbridge-sqs-apigateway/?couponCode=KEEPLEARNING)
