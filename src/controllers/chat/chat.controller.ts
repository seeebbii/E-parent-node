import express from 'express' 
import ChatSchema from '../../schema/chat/chat_schema'
import MessageSchema from '../../schema/chat/message_schema'
import AuthSchema from '../../schema/auth/auth_schema'
import NotificationSchema from '../../schema/notification/notification_schema'
import {SocketHandler} from '../../service/socket_handler'
import {Utils} from '../../service/utils'
import FirebaseAdminHelper from '../../service/firebase_admin_helper'
import { json } from 'body-parser'

exports.getAllChats = async (req: express.Request, res: express.Response, next : express.NextFunction) => {

    const user_id = req.params.user_id;

    // Load all the chats against this userid

    let chats = await ChatSchema.find({$or: [{first_user: user_id}, {second_user: user_id}]}).sort({last_message_sent_at: -1})


    for(var chat of chats){

        chat.first_user = await AuthSchema.findById({_id: chat.first_user,});
        chat.second_user = await AuthSchema.findById({_id: chat.second_user,});

    }


    res.status(200).json({status:200, success: true, data: chats})

}


exports.getAdminUsersForChat = async (req: express.Request, res: express.Response, next : express.NextFunction) => {
    // const user_id = req.params.user_id;

    let adminChats: Array<Object> = [];

    let admins = await AuthSchema.find({admin: true});

    res.status(200).json({status:200, success: true, data: admins})

}

exports.getAllMessages = async (req: express.Request, res: express.Response, next : express.NextFunction) => {
    const chat_room_id = req.params.chat_room_id;

    let messagesList: any = await MessageSchema.findOne({room_id: chat_room_id});

    if(messagesList != null) {
        for(var message of messagesList.messages){
            message.sent_by = await AuthSchema.findOne({_id: message.sent_by})
        }
    }


    res.status(200).json({status:200, success: true, data: messagesList})

}


exports.createRoom = async (req: express.Request, res: express.Response, next : express.NextFunction) => {

    const {first_user, second_user, room_id} = req.body


    const firstUser = await AuthSchema.findById({_id: first_user,});
    const secondUser = await AuthSchema.findById({_id: second_user,});

    if(firstUser == null || secondUser == null){
        return res.status(404).json({status:404, success: false, message: "No such user"})
    }


    // Check if room already exists

    var status = await ChatSchema.findOne({room_id: room_id});

    if(status != null){
        // Chat room already exists between these users
        return res.status(200).json({status: 200, success: true, message: "Room already exists"})
    }

    new ChatSchema({
        first_user: first_user, 
        second_user: second_user,
        room_id: room_id,
    }).save()
    .then(async (result) => {
        // Creating a room in messagesSchema also
        await new MessageSchema(
            {
                room_id: room_id,
                messages: []
            }
        ).save();
        res.status(200).json({status: 200, success: true, message: "Room created successfully"})
    })
    .catch((e) => {
        res.status(400).json({status:400, success: false, message: e})
    });

    

}


exports.sendMessage = async (req: express.Request, res: express.Response, next : express.NextFunction) => {
    
    const {room_id, sent_by, message, sent_to, socket_id} = req.body


    // ! Fetch sent_by and sent_to user objects

    var sentByUser = await AuthSchema.findById({_id: sent_by,});
    var sentToUser = await AuthSchema.findById({_id: sent_to,});


    let messageObject = {
        "room_id": room_id,
        "sent_by": sent_by,
        "sent_to": sent_to,
        "message": message,
        "sent_at": Date.now()
    }

    // Emit from the socket after cmparing socket id to our list
    // let index = SocketHandler.currentSocket.findIndex(e => e.id === socket_id)
    // SocketHandler.currentSocket[index].emit('message', JSON.stringify(messageObject));

    SocketHandler.io.emit('message', JSON.stringify(messageObject));

    // console.log(`Emitting using the socket id: ${SocketHandler.currentSocket[index].id}`)

    // Find if the room already exists

    let messageRoom = await MessageSchema.findOne({room_id: room_id});

    if(messageRoom != null){
        // The room already exists and now we just have to update message elements in messages array
        let messageSentResponse = await messageRoom.updateOne( { $push: { messages: messageObject } },)

        if(messageSentResponse != null) {

            // Update last message and date of chat room
            await ChatSchema.findOneAndUpdate({room_id: room_id}, {last_message: messageObject.message, last_message_sent_at: messageObject.sent_at})

            res.status(200).json({status: 200, success: true, message: "Message sent"})
        }else{
            res.status(500).json({status: 500, success: false, message: "Unable to send message"})
        }

    }else{
        await new MessageSchema(
            {
                sent_by: sent_by,
                room_id: room_id,
                messages: [messageObject]
            }
        ).save().then( async (roomRes) => {

            // Update last message and date of chat room

            await ChatSchema.findOneAndUpdate({room_id: room_id}, {last_message: messageObject.message, last_message_sent_at: messageObject.sent_at})

            res.status(200).json({status: 200, success: true, message: "Room created and message sent"})
        }).catch((e) => {
            res.status(500).json({status: 500, success: false, message: e})
        });

    }

    


    // ! Send a push notification and add a notification to sent_to user notifications list

    const notification_options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    };

    const message_payload = Utils.formatNotificationMessage(`${sentByUser!.full_name} sent you a message`, message);


    FirebaseAdminHelper.messaging().sendToDevice(sentToUser!.fcm_token, message_payload, notification_options);
    await new NotificationSchema({sent_by: sentByUser!._id, sent_to: sentToUser!._id, notification_type: "Message", title: message_payload.notification.title, description: message_payload.notification.body,}).save()

}

