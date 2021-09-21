const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Type a Message'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'This channel must be created by a user'],
      ref: 'User',
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Channel',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Message', MessageSchema)
