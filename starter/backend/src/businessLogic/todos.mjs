import { v4 as uuidv4 } from 'uuid'
import { TodosAccess } from '../dataLayer/todosAcces.mjs'

const groupsAccess = new TodosAccess()

export async function getAllTodos(userId) {
    return groupsAccess.getAllTodos(userId)
}

export async function createTodo(createTodoRequest, userId) {
    const groupId = uuidv4()
    return groupsAccess.createTodo({
        todoId: groupId,
        userId: userId,
        name: createTodoRequest.name,
        createdAt: createTodoRequest.createdAt,
        done: createTodoRequest.done,
        dueDate: createTodoRequest.dueDate
    })  
}

export async function updateTodo(todoId, userId, updateTodoRequest){
    return groupsAccess.updateTodo(todoId, userId, updateTodoRequest)
}

export async function createImage(todoId, userId, createImageRequest){
    return groupsAccess.createImage({
        todoId: todoId,
        userId: userId, 
        attachmentUrl: `https://${groupsAccess.bucketName}.s3.us-east-1.amazonaws.com/${todoId}`, 
        ...createImageRequest
    })
}

export async function getUploadUrl(todoId){
    return groupsAccess.getUploadUrl(todoId)
}

export async function deleteTodo(todoId, userId){
    return groupsAccess.deleteTodo(todoId, userId)
}

export async function getImage(todoId, userId){
    return groupsAccess.getImage(todoId, userId)
}