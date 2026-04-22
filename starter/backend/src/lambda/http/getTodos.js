import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getAllTodos } from '../../businessLogic/todos.mjs'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('getodos')

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    origin: '*',
    credentials: true
  }))
  .handler(async (event) => {
    // TODO: Get all TODO items for a current user
    logger.error('Processing event: ', event)
    const userId = event.requestContext.authorizer.principalId
    const items = await getAllTodos(userId)
    return {
      statusCode: 200,
      body: JSON.stringify({
        items
      })
    }
  })
  
