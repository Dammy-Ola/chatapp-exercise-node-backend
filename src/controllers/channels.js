const asyncHandler = require('../middleware/async')
const Channel = require('../models/Channel')
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')

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
exports.getChannel = asyncHandler(async (req, res, next) => {
  const channel = await Channel.findById(req.params.id)
    .populate({
      path: 'creator',
      select: 'name email',
    })
    .populate({
      path: 'members',
      select: 'name email',
    })

  if (!channel) {
    return next(
      new ErrorResponse(`Channel not found with id of ${req.params.id}`, 404)
    )
  }

  // checking if user is a member of the channel
  const channelMember = await channel.members.some(
    (member) => member.email === req.user.email
  )

  // else add the user to the channel
  if (!channelMember) {
    await channel.members.unshift(req.user)
    await channel.save()
  }

  res.status(200).json({
    success: true,
    countMembers: channel.members.length,
    data: channel,
  })
})

// @desc        Create a New Channel
// @route       POST /api/v1/channels
// @access      Private
exports.createChannel = asyncHandler(async (req, res, next) => {
  req.body.creator = req.user
  const channel = await Channel.create(req.body)

  // Adding the creator to the channel by default
  await channel.members.unshift(channel.creator)
  await channel.save()

  res.status(201).json({
    success: true,
    data: channel,
  })
})
