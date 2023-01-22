import express from 'express'
import Token from "../service/token";
const chatController = require('../controllers/chat/chat.controller');

const router = express.Router();

router.get('/:user_id', Token.verifyToken, chatController.getAllChats)

router.get('/admin/:user_id', Token.verifyToken, chatController.getAdminUsersForChat)

router.get('/messages/:chat_room_id', Token.verifyToken, chatController.getAllMessages)

router.post('/create_room', Token.verifyToken, chatController.createRoom)

router.post('/send_message', Token.verifyToken, chatController.sendMessage)

export default router;