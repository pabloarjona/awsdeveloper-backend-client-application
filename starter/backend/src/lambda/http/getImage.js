import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'


const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())

const imagesIndex = process.env.IMAGE_ID_INDEX

// TODO: Return a presigned URL to upload a file for a TODO item with the provided id
export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    origin: '*',
    credentials: true
  }))
  .handler(async (event) => {
      console.log('Processing event: ', event)
/*   const imageId = event.pathParameters.imageId
  
  const result = await dynamoDbClient.query({
    TableName: imageTable,
    IndexName: imagesIndex,
    KeyConditionExpression: 'imageId = :imageId',
    ExpressionAttributeValues: {
      ':imageId': imageId
    }
  }) */
  const groupId = event.pathParameters.todoId
  const result = await dynamoDbClient.query({
    TableName: imageTable,
    KeyConditionExpression: 'groupId = :groupId',
    ExpressionAttributeValues: {
      ':groupId': groupId
    }
  })
  
  if (result.Count !== 0) {
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items[0])
    }
  }
  throw createError(404, JSON.stringify({ error: 'Image not found' }))
})

