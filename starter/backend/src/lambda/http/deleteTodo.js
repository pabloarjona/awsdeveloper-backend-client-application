import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import createError from 'http-errors'
import { deleteTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('deletetodo')

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
      logger.error('Deleting todo with id: ', todoId, ' for user: ', userId)
      if (!todoId || !userId) {
        console.error('Missing todoId or userId in path parameters')
        throw createError(
          400,
          JSON.stringify({ error: 'Missing todoId or userId in path parameters' })  
        )
      }
      await deleteTodo(todoId, userId)
      return {
        statusCode: 204,
        body: JSON.stringify({'message': 'Todo deleted successfully :)'
      })
    }

})

