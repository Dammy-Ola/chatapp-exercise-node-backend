const Message = require('../models/Message')

// @desc        Get all Messages
// @route       GET /api/v1/messages
// @access      Private
exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find()

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
    })
  }
}

// @desc        Get A Single Message
// @route       GET /api/v1/Messages/:id
// @access      Private
exports.getMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id)

    if (!message) {
      return res.status(500).json({
        success: false,
      })
    }

    res.status(200).json({
      success: true,
      data: message,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
    })
  }
}

// @desc        Add a New Message
// @route       POST /api/v1/messages
// @access      Private
exports.createMessage = async (req, res, next) => {
  try {
    const message = await Message.create(req.body)

    res.status(201).json({
      success: true,
      data: message,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
    })
  }
}
