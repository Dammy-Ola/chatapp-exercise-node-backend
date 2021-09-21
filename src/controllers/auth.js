const asyncHandler = require('../middleware/async')
const Channel = require('../models/Channel')
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const generateToken = require('../utils/generateToken')

// @desc        Register a New User
// @route       GET /api/v1/auth/register
// @access      Public
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { email } = req.body

  // checking if user exists in the database
  const userExists = await User.findOne({ email })

  if (userExists) {
    return next(new ErrorResponse(`User already exists`, 400))
  }

  const user = await User.create(req.body)

  // Adding user to the default channel by default
  // 1. Adding channel to the user model
  const welcomeChannel = await Channel.findOne({ name: 'Welcome Channel' })
  await user.channels.unshift(welcomeChannel)
  await user.save()
  // 2. Adding user to the channel model
  await welcomeChannel.users.unshift(user)
  await welcomeChannel.save()
  await welcomeChannel.populate({
    path: 'users',
  })

  // return registered user with the token
  if (user) {
    const { _id, name, email, channels } = user
    return res.status(201).json({
      _id,
      name,
      email,
      token: generateToken(_id),
      welcomeChannel,
    })
  } else {
    return next(new ErrorResponse(`Invalid User Data`, 404))
  }
})

// @desc        Auth  user & get token
// @route       GET /api/v1/auth/login
// @access      Public
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  // Email & Password Validation
  if (!email && !password) {
    return next(new ErrorResponse(`Please provide email and password`, 400))
  }

  const user = await User.findOne({ email }).select('+password')
  // Check if the email or password is provided
  if (!user) {
    return next(new ErrorResponse(`Invalid credentials`, 401))
  }

  const isMatch = await user.matchPassword(password)

  if (!isMatch) {
    return next(new ErrorResponse(`Invalid credentials`, 401))
  }

  if (user && isMatch) {
    const { _id, name, email } = user
    res.status(201).json({
      _id,
      name,
      email,
      token: generateToken(_id),
    })
  }
})
