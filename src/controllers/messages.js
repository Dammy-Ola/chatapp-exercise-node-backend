const Message = require('../models/Message')
const Channel = require('../models/Channel')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')

// @desc        Get all Messages
// @route       GET /api/v1/messages
// @route       GET /api/v1/channels/:channelId/messages
// @access      Private
exports.getMessages = asyncHandler(async (req, res, next) => {
  let query

  if (req.params.channelId) {
    query = await Message.find({ channel: req.params.channelId })
      .sort({ createdAt: 'asc' })
      .populate({
        path: 'channel',
        select: 'name description',
      })
      .populate({
        path: 'user',
        select: 'name email',
      })
  } else {
    query = await Message.find()
      .sort({ createdAt: 'asc' })
      .populate({
        path: 'channel',
        select: 'name description',
      })
      .populate({
        path: 'user',
        select: 'name email',
      })
  }

  const messages = await query

  res.status(200).json({
    success: true,
    count: messages.length,
    data: messages,
  })
})

// @desc        Get A Single Message
// @route       GET /api/v1/Messages/:id
// @access      Private
exports.getMessage = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id).populate({
    path: 'channel',
    select: 'name description',
  })

  if (!message) {
    return next(
      new ErrorResponse(`Message not found with id of ${req.params.id}`, 404)
    )
  }

  res.status(200).json({
    success: true,
    data: message,
  })
})

// @desc        Add a New Message
// @route       POST /api/v1/channels/:channelId/messages
// @access      Private
exports.createMessage = asyncHandler(async (req, res, next) => {
  req.body.user = req.user
  req.body.channel = req.params.channelId

  // checking if the channel exist
  const channel = await Channel.findById(req.params.channelId).populate({
    path: 'members',
    select: 'email',
  })
  if (!channel) {
    return next(
      new ErrorResponse(
        `Channel not found with id of ${req.params.channelId}`,
        404
      )
    )
  }

  // console.log(channel.members[0].email)

  // checking if user is a member of the channel
  const channelMember = await channel.members.some(
    (member) => member._id === req.user._id
  )
  // else add the user to the channel
  if (!channelMember) {
    await channel.members.unshift(req.user)
    await channel.save()
  }

  // Creating the message
  const message = await Message.create(req.body)

  // Adding the newly created message to the channel
  await channel.messages.unshift(message)
  await channel.save()

  res.status(201).json({
    success: true,
    data: message,
  })
})
