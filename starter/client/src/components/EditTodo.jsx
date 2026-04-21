import { useAuth0 } from '@auth0/auth0-react'
import React, { useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { Button, Form } from 'semantic-ui-react'
import { getUploadUrl, uploadFile, patchTodo } from '../api/todos-api'
import dateFormat from 'dateformat'

const UploadState = {
  NoUpload: 'NoUpload',
  FetchingPresignedUrl: 'FetchingPresignedUrl',
  UploadingFile: 'UploadingFile'
}

export function EditTodo() {
  console.log('Rendering EditTodo')
  function renderButton() {
    return (
      <div>
        {uploadState === UploadState.FetchingPresignedUrl && (
          <p>Uploading image metadata</p>
        )}
        {uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button loading={uploadState !== UploadState.NoUpload} type="submit">
          Upload
        </Button>
      </div>
    )
  }
  function renderButtonUser() {
    console.log('Rendering user info update button')
    return (
      <div>
        <Button type="submit">
          Update TODO
        </Button>
      </div>
    )
  }

  function handleFileChange(event) {
    const files = event.target.files
    if (!files) return

    setFile(files[0])
  }
  async function handleSubmitUser(event) {
    console.log('Submitting user info', todo)
    event.preventDefault()
    const accessToken = await getAccessTokenSilently({
          audience: `https://todo-api/`,
          scope: 'write:todo'
        })
    const dueDate = calculateDueDate()
    const updateTodo = await patchTodo(accessToken, todoId, { name: todo.name, description: todo.description })
    console.log('TODO updated', updateTodo)
    alert('TODO updated successfully')
  }

  async function handleSubmit(event) {
    console.log('Submitting file', file)
    event.preventDefault()
    console.log('Checking if file is selected...')
    try {
      if (!file) {
        alert('File should be selected')
        return
      } 

      setUploadState(UploadState.FetchingPresignedUrl)
      const accessToken = await getAccessTokenSilently({
          audience: `https://todo-api/`,
          scope: 'write:todo'
        })
      console.log('Calling api to get a presigned url to upload file....')
      console.log('todoId', todoId)
      //APPLY HERE TODO UPDATE TODO FROM A FORM IN THE FRONTEND EDITODO
      const uploadUrl = await getUploadUrl(accessToken, todoId)
      console.log('Received presigned url: ' + uploadUrl)
      setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, file)
        
      //await uploadFile(uploadUrl, file)

      alert('File was uploaded!')
    } catch (e) {
      alert('Could not upload a file: ' + e.message)
    } finally {
      setUploadState(UploadState.NoUpload)
    }
  }
  console.log('State variables file and uploadState will be used to manage the selected file and the current state of the upload process, respectively')
  const [file, setFile] = useState(undefined)
  const [uploadState, setUploadState] = useState(UploadState.NoUpload)
  const { getAccessTokenSilently } = useAuth0()
  const { todoId } = useParams()
  const { state } = useLocation()
  const [todo, setTodo] = useState(state?.todo)
  console.log('todoId from useParams', todoId)
  console.log('todo from useLocation', todo)
  return (
    <div>
      <h1>Edit TODO</h1>
      <Form onSubmit={handleSubmitUser}>
        <Form.Field>
          <label>Todo name</label>
          <input
            type="text"
            value={todo?.name || ''}
            onChange={(e) => setTodo({ ...todo, name: e.target.value })}
          />
        </Form.Field>
        <Form.Field>
          <label>Todo description</label>
          <input
            type="text"
            value={todo?.description || ''}
            onChange={(e) => setTodo({ ...todo, description: e.target.value })}
          />
        </Form.Field>
        {renderButtonUser()}
      </Form>
      <h1>Upload new image</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>File</label>
          <input
            type="file"
            accept="image/*"
            placeholder="Image to upload"
            onChange={handleFileChange}
          />
        </Form.Field>

        {renderButton()}
      </Form>
    </div>
  )
}


function calculateDueDate() {
  const date = new Date()
  date.setDate(date.getDate() + 7)

  return dateFormat(date, 'yyyy-mm-dd')
}
