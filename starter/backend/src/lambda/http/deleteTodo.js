import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import createError from 'http-errors'
import { deleteGroup } from '../../businessLogic/groups.mjs'

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
      console.log('Deleting todo with id: ', todoId, ' for user: ', userId)
      if (!todoId || !userId) {
        console.error('Missing todoId or userId in path parameters')
        throw createError(
          400,
          JSON.stringify({ error: 'Missing todoId or userId in path parameters' })  
        )
      }
      await deleteGroup(todoId, userId)
      return {
        statusCode: 204,
        body: JSON.stringify({'message': 'Todo deleted successfully :)'
      })
    }

})

