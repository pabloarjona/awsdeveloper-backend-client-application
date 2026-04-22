import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createGroup } from '../../businessLogic/groups.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    origin: '*',
    credentials: true
  }))
  .handler(async (event) => {
    console.log('Processing event: ', event)
    const userId = event.requestContext.authorizer.principalId
    const parsedBody = JSON.parse(event.body)
    const newItem = await createGroup(parsedBody, userId)
    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newItem
      })
    }
  })
