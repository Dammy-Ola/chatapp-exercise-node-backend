const Message = require('../models/Message')
const Channel = require('../models/Channel')

// @desc        Get all Messages
// @route       GET /api/v1/messages
// @access      Private
exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: 'asc' }).populate({
      path: 'channel',
      select: 'name description',
    })

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
}

// @desc        Get A Single Message
// @route       GET /api/v1/Messages/:id
// @access      Private
exports.getMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id).populate({
      path: 'channel',
      select: 'name description',
    })

    if (!message) {
      return res.status(500).json({
        success: false,
        error: err.message,
      })
    }

    res.status(200).json({
      success: true,
      data: message,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
}

// @desc        Add a New Message
// @route       POST /api/v1/messages/:channelId
// @access      Private
exports.createMessage = async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.channelId)

    if (!channel) {
      return res.status(500).json({
        success: false,
        error: "Can't Find Channel",
      })
    } else {
      req.body.channel = req.params.channelId
      const message = await Message.create(req.body)

      await channel.messages.unshift(message)

      await channel.save()

      res.status(201).json({
        success: true,
        data: message,
      })
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
}
