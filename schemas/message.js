const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  fromUserId: String,
  toUserId: String,
  roomId: String,
  message: String,
  dateSent: Date,
});

module.exports = mongoose.model("Message", MessageSchema);
