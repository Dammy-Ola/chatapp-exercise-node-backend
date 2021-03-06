const mongoose = require('mongoose')

const ChannelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'The name of the channel is required'],
    },
    description: {
      type: String,
      required: [true, 'The description of the channel is required'],
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'This channel must be created by a user'],
      ref: 'User',
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Message',
      },
    ],
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Channel', ChannelSchema)
