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
  console.log('Getting group with id: ', todoId, ' for user: ', userId)
  const newItem = await createImage(todoId, userId, event)
  console.log('Created new item: ', newItem)
  const url = await getUploadUrl(todoId)
  console.log('Got upload url: ', url)
  return {
    statusCode: 201,
    body: JSON.stringify({
      newItem: newItem,
      uploadUrl: url
    })
  }
})


async function createImage(todoId, userId, event) {
  const newImage = JSON.parse(event.body)
  const newItem = {
    todoId: todoId,
    userId: userId,
    imageUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`,
    ...newImage
  }
  console.log('Creating new item: ', newItem)
     await dynamoDbClient.update({
        TableName: groupsTable,
        Key: {
          todoId: todoId,
          userId: userId
        },
        UpdateExpression: 'set #attr1 = :attr1',
        ExpressionAttributeNames: {
          '#attr1': 'imageUrl'
        },
        ExpressionAttributeValues: {
          ':attr1': newItem.imageUrl
        },
        ReturnValues: 'ALL_NEW'
      })
  return newItem
}

async function getUploadUrl(imageId) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: imageId
  })
  const url = await getSignedUrl(s3Client, command, { expiresIn: urlExpiration })
  return url
}