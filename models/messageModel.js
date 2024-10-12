const mongoose = require('mongoose');

const messageModel = mongoose.Schema({

  // receiver: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  //   required: true,
  // },
  sender: { type: mongoose.Schema.Types.ObjectID, ref: "User" },
  content: { type: String, trim: true },
  chat: { type: mongoose.Schema.Types.ObjectID, ref: "chats" }
}, {
  timestamps: true
});

const Message = mongoose.model("Message", messageModel);

module.exports = Message;
