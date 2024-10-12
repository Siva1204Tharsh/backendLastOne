const express = require("express");
const { protect } = require("../middleware/verifyToken");
const Chat = require("../models/chatModel.js");

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        console.log(req.body); // Log the incoming body

        const { sender, senderModel, receiver, receiverModel, message } = req.body; // Update variable names
        const newMessage = new Chat({ sender, senderModel, receiver, receiverModel, message }); // Update the variable names here
        const savedMessage = await newMessage.save();

        // Emit the new message event
        req.app.get('io').emit('message', savedMessage);

        res.status(201).json(savedMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:senderId/:senderModel/:receiverId/:receiverModel', async (req, res) => {
    try {
        const { senderId, senderModel, receiverId, receiverModel } = req.params;
        const messages = await Chat.find({
            $or: [
                { sender: senderId, senderModel, receiver: receiverId, receiverModel },
                { sender: receiverId, senderModel: receiverModel, receiver: senderId, receiverModel: senderModel },
            ],
        }).exec();
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
