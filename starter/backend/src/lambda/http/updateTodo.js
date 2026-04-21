import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import createError from 'http-errors'

const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())
const s3Client = new S3Client()
const groupsTable = process.env.GROUPS_TABLE
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    origin: '*',
    credentials: true
  }))
  .handler(async (event) => {
    console.log('Processing event: ', event)
    const todoId = event.pathParameters.todoId
    const userId = event.requestContext.authorizer.principalId
    const parsedBody = JSON.parse(event.body)
    //const imageUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`
    await dynamoDbClient.update({
          TableName: groupsTable,
          Key: {
            todoId: todoId,
            userId: userId
          },
          UpdateExpression: 'set #attr1 = :attr1, #attr2 = :attr2',
          ExpressionAttributeNames: {
            '#attr1': 'name',
            '#attr2': 'description'
          },
          ExpressionAttributeValues: {
            ':attr1': parsedBody.name,
            ':attr2': parsedBody.description
          },
          ReturnValues: 'ALL_NEW'
        })
    return {
      statusCode: 200,
      body: JSON.stringify({
        item: {
          todoId: todoId,
          userId: userId,
          ...parsedBody
        }
      })
    }
  })