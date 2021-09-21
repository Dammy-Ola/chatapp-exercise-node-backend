const asyncHandler = require('../middleware/async')
const Channel = require('../models/Channel')

// @desc        Get all Channels
// @route       GET /api/v1/channels
// @access      Private
exports.getChannels = async (req, res, next) => {
  try {
    const channels = await Channel.find().populate({
      path: 'messages',
    })

    res.status(200).json({
      success: true,
      count: channels.length,
      data: channels,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
}

// @desc        Get A Single Channel
// @route       GET /api/v1/channels/:id
// @access      Private
exports.getChannel = async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.id)

    if (!channel) {
      return res.status(500).json({
        success: false,
        error: err.message,
      })
    }

    res.status(200).json({
      success: true,
      data: channel,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
}

// @desc        Create a New Channel
// @route       POST /api/v1/channels
// @access      Private
exports.createChannel = asyncHandler(async (req, res, next) => {
  req.body.creator = req.user
  const channel = await Channel.create(req.body)

  // Adding the creator to the channel by default
  await channel.members.unshift(req.body.creator)

  res.status(201).json({
    success: true,
    data: channel,
  })
})
