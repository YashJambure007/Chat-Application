import ConversationModel from "../models/Converstion.js";
import MessageModel from "../models/Messages.js";

export const SendMessage = async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  if (!senderId || !receiverId || !message) {
    return res.status(400).json({
      success: false,
      message: `${
        !senderId ? "Sender Id" : !receiverId ? "Receiver Id" : "Message"
      } is required.`,
    });
  }

  try {
    const newMessage = new MessageModel({
      userId: senderId,
      message,
    });

    const savedMessage = await newMessage.save();

    let conversation = await ConversationModel.findOne({
      members: { $all: [senderId, receiverId], $size: 2 },
    });

    if (conversation) {
      conversation = await ConversationModel.findByIdAndUpdate(
        conversation._id,
        { $push: { messages: savedMessage._id } },
        { new: true }
      );
    } else {
      conversation = await ConversationModel.create({
        members: [senderId, receiverId],
        messages: [savedMessage._id],
      });
    }

    return res.status(200).json({
      success: true,
      message: savedMessage, 
    });
  } catch (error) {
    console.error("Message error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again.",
    });
  }
};

export const getMessages = async (req, res) => {
  const { senderId, receiverId } = req.params;

  if (!senderId || !receiverId) {
    return res.status(400).json({
      success: false,
      message: `${!senderId ? "Sender Id" : "Receiver Id"} is required.`,
    });
  }

  try {
    let conversation = await ConversationModel.findOne({
      members: { $all: [senderId, receiverId], $size: 2 },
    }).populate("messages");

    if (!conversation) {
      conversation = await ConversationModel.create({
        members: [senderId, receiverId],
        messages: [],
      });

      return res.status(200).json({
        success: true,
        messages: [],
      });
    }

    return res.status(200).json({
      success: true,
      messages: conversation.messages,
    });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve messages. Please try again.",
    });
  }
};
