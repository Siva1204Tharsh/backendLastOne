
const mongoose = require('mongoose')
const chatModel = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'senderModel',
    },
    senderModel: {
      type: String,
      required: true,
      enum: ['tourGuide', 'traveler'],
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'receiverModel',
    },
    receiverModel: {
      type: String,
      required: true,
      enum: ['tourGuide', 'traveler'],
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }
);

const Chat = mongoose.model("chats",chatModel);

module.exports =Chat;


// const Chat = mongoose.model('chats', chatModel);
// export default Chat;