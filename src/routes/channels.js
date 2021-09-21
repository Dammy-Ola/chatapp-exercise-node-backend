const express = require('express')
const {
  createChannel,
  getChannels,
  getChannel,
} = require('../controllers/channels')
const { protect } = require('../middleware/auth')
const router = express.Router()

// Include other resource router
const messageRouter = require('./messages')

router.route('/').get(protect, getChannels).post(protect, createChannel)
router.route('/:id').get(protect, getChannel)

// Re-route into other resource router
router.use('/:channelId/messages', messageRouter)

module.exports = router
