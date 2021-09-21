const jwt = require('jsonwebtoken')
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('./async')

exports.protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  // Make sure token exists
  if (!token) {
    res.status(401)
    return next(new ErrorResponse('Not authorized to access this route', 401))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECTRET)

    req.user = await User.findById(decoded.id)

    next()
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401))
  }
})
