import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('createtodo')

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    origin: '*',
    credentials: true
  }))
  .handler(async (event) => {
    logger.error('Processing event: ', event)
    const userId = event.requestContext.authorizer.principalId
    const parsedBody = JSON.parse(event.body)
    const newItem = await createTodo(parsedBody, userId)
    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newItem
      })
    }
  })
