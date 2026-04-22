import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createImage, getUploadUrl } from '../../businessLogic/groups.mjs'

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
  const newImage = JSON.parse(event.body)
  const newItem = await createImage(todoId, userId, newImage)
  const url = await getUploadUrl(todoId)
  console.log('Got upload url: ', url)
  return {
    statusCode: 201,
    body: JSON.stringify({
      newItem: newItem,
      uploadUrl: url
    })
  }
})
