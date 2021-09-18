const express = require('express')
const {
  createChannel,
  getChannels,
  getChannel,
} = require('../controllers/channels')
const router = express.Router()

router.route('/').get(getChannels).post(createChannel)
router.route('/:id').get(getChannel)

module.exports = router
