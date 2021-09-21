const express = require('express')
const {
  createChannel,
  getChannels,
  getChannel,
} = require('../controllers/channels')
const { protect } = require('../middleware/auth')
const router = express.Router()

router.route('/').get(protect, getChannels).post(protect, createChannel)
router.route('/:id').get(protect, getChannel)

module.exports = router
