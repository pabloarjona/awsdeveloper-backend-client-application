import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'
//import { parseUserId } from '../auth/utils.mjs'
const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())
const groupsTable = process.env.GROUPS_TABLE

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    origin: '*',
    credentials: true
  }))
  .handler(async (event) => {
    console.log('Processing event: ', event)
    const itemId = uuidv4()
    //const userId = parseUserId(event.headers.Authorization)
    const userId = event.requestContext.authorizer.principalId
    //const userId = 'user'
    const parsedBody = JSON.parse(event.body)
    const newItem = {
      todoId: itemId,
      userId: userId,
      ...parsedBody
    }
    await dynamoDbClient.put({
      TableName: groupsTable,
      Item: newItem
    })
  // TODO: Implement creating a new TODO item
  return {
    statusCode: 201,
    body: JSON.stringify({
      item: newItem
      })
    }
  })
