import { v4 as uuidv4 } from 'uuid'
import { GroupsAccess } from '../dataLayer/groupsAccess.mjs'

const groupsAccess = new GroupsAccess()

export async function getAllGroups(userId) {
    return groupsAccess.getAllGroups(userId)
}

export async function createGroup(createGroupRequest, userId) {
    const groupId = uuidv4()
    return groupsAccess.createGroup({
        todoId: groupId,
        userId: userId,
        name: createGroupRequest.name,
        description: createGroupRequest.description
    })  
}

export async function updateGroup(todoId, userId, updateGroupRequest){
    return groupsAccess.updateGroup(todoId, userId, updateGroupRequest)
}

export async function createImage(todoId, userId, createImageRequest){
    return groupsAccess.createImage({
        todoId: todoId,
        userId: userId, 
        imageUrl: `https://${groupsAccess.bucketName}.s3.amazonaws.com/${todoId}`, 
        ...createImageRequest
    })
}

export async function getUploadUrl(todoId){
    return groupsAccess.getUploadUrl(todoId)
}

export async function deleteGroup(todoId, userId){
    return groupsAccess.deleteGroup(todoId, userId)
}

export async function getImage(todoId, userId){
    return groupsAccess.getImage(todoId, userId)
}