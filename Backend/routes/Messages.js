import express from 'express'
import { getMessages, SendMessage } from '../controllers/Message.js'

const MessageRoutes = express.Router();

// GET messages between two users
MessageRoutes.get('/:senderId/:receiverId', getMessages);

// SEND message
MessageRoutes.post('/send', SendMessage);

export default MessageRoutes;
