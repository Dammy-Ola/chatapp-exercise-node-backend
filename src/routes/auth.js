const express = require('express')
const passport = require('passport')
const router = express.Router()

// @desc        Authenticate User Google
// @route       GET /api/v1/auth/google
// @access      Public
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
)

// @desc        Google Auth Callback
// @route       GET /api/v1/auth/google/callback
// @access      Public
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureMessage: "You can't login with google, try again later!",
    failureRedirect: process.env.CLIENT_ROUTE_AUTH_FAILURE,
    successRedirect: process.env.CLIENT_ROUTE_AUTH_SUCCESS,
  }),
  (req, res) => {
    res.status(200).json({
      user: req.user,
    })
  }
)

module.exports = router
