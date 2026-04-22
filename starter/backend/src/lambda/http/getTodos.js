import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getAllGroups } from '../../businessLogic/groups.mjs'

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
    const items = await getAllGroups(userId)
    return {
      statusCode: 200,
      body: JSON.stringify({
        items
      })
    }
  })
  
