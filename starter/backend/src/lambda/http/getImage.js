import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getImage } from '../../businessLogic/todos.mjs'

// TODO: Return a presigned URL to upload a file for a TODO item with the provided id
export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    origin: '*',
    credentials: true
  }))
  .handler(async (event) => {
    const todoId = event.pathParameters.todoId
    const userId = event.requestContext.authorizer.principalId
    const result = await getImage(todoId, userId)
    
    if (result.Count !== 0) {
      return {
        statusCode: 200,
        body: JSON.stringify(result.Items[0])
      }
    }
    throw createError(404, JSON.stringify({ error: 'Image not found' }))
})

