import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { updateTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('updatetodo')
export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    origin: '*',
    credentials: true
  }))
  .handler(async (event) => {
    logger.error('Processing event: ', event)
    const todoId = event.pathParameters.todoId
    const userId = event.requestContext.authorizer.principalId
    const parsedBody = JSON.parse(event.body)
    await updateTodo(todoId, userId, parsedBody)
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