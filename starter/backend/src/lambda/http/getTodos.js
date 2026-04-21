import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import createError from 'http-errors'

const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())
const groupsTable = process.env.GROUPS_TABLE

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    origin: '*',
    credentials: true
  }))
  .handler(async (event) => {
    // TODO: Get all TODO items for a current user
    console.log('Processing event: ', event)
    const userId = event.requestContext.authorizer.principalId
    const result = await dynamoDbClient.query({
      TableName: groupsTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    })
    const items = result.Items || []
    return {
      statusCode: 200,
      body: JSON.stringify({
        items
      })
    }
  })
  
