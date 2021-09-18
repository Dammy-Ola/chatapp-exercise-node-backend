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
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Channel', ChannelSchema)
