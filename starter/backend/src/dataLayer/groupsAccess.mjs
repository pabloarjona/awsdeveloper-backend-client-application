import { DynamoDB } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb"
import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import AWSXRay from 'aws-xray-sdk-core'

export class GroupsAccess {
    constructor(
        docClient = AWSXRay.captureAWSv3Client(new DynamoDB()), 
        groupsTable = process.env.GROUPS_TABLE,
        bucketName = process.env.IMAGES_S3_BUCKET,
        urlExpiration = process.env.SIGNED_URL_EXPIRATION,
    ) {
        this.docClient = docClient
        this.groupsTable = groupsTable
        this.bucketName = bucketName
        this.urlExpiration = urlExpiration
        this.dynamoDbClient= DynamoDBDocument.from(this.docClient)
        this.s3Client = new S3Client()
    }   

    async getAllGroups(userId) {
        console.log('Getting all groups for user:', userId)
        const result = await this.dynamoDbClient.query({
        TableName: this.groupsTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
        })
        return result.Items || []
    }

    async createGroup(createGroupRequest) {    
        console.log('Creating group:', createGroupRequest)
        await this.dynamoDbClient.put({
            TableName: this.groupsTable,
            Item: createGroupRequest
        })
        return createGroupRequest
    }

    async updateGroup(groupId, userId, updateGroupRequest) {
        console.log('Updating group with id: ', groupId, ' for user: ', userId)
        await this.dynamoDbClient.update({
            TableName: this.groupsTable,
            Key: {
                todoId: groupId,
                userId: userId
            },
            UpdateExpression: 'set #attr1 = :attr1, #attr2 = :attr2',
            ExpressionAttributeNames: {
                '#attr1': 'name',
                '#attr2': 'description'
            },
            ExpressionAttributeValues: {
                ':attr1': updateGroupRequest.name,
                ':attr2': updateGroupRequest.description
            },
            ReturnValues: 'ALL_NEW'
        })
    }

    async createImage(newGroupRequest){
        console.log('Creating new image: ', newGroupRequest)
        await this.dynamoDbClient.update({
            TableName: this.groupsTable,
            Key: {
                todoId: newGroupRequest.todoId,
                userId: newGroupRequest.userId
            },
            UpdateExpression: 'set #attr1 = :attr1',
            ExpressionAttributeNames: {
            '#attr1': 'imageUrl'
            },
            ExpressionAttributeValues: {    
            ':attr1': newGroupRequest.imageUrl
            },
            ReturnValues: 'ALL_NEW'
        })
        return newGroupRequest
    }

    async getUploadUrl(imageId) {
        console.log("Getting upload url of ", imageId)
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: imageId
        })
        const url = await getSignedUrl(this.s3Client, command, { expiresIn: this.urlExpiration })
        console.log("Got upload url: ", url)
        return url
    }

    async deleteGroup(todoId, userId){
        console.log('Deleting todo with id: ', todoId, ' for user: ', userId)
        await this.dynamoDbClient.delete({
            TableName: this.groupsTable,
            Key: {
                userId: userId,
                todoId: todoId
            }
        })
      console.log('Deleted todo with id: ', todoId, ' for user: ', userId)
    }

    async getImage(todoId, userId){
        console.log('Getting image with id: ', todoId, ' for user: ', userId)
        const result = await this.dynamoDbClient.query({
            TableName: this.groupsTable,
            KeyConditionExpression: 'userId = :userId AND todoId = :todoId',
            ExpressionAttributeValues: {
                ':userId': userId,
                ':todoId': todoId
            }
        })    
        console.log("Get image successfully :)")
        return result
    }

}