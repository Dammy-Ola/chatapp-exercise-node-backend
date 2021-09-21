const express = require('express')
const {
  getMessages,
  createMessage,
  getMessage,
} = require('../controllers/messages')
const { protect } = require('../middleware/auth')

const router = express.Router({ mergeParams: true })

router.route('/').get(protect, getMessages).post(protect, createMessage)
router.route('/:id').get(protect, getMessage)

module.exports = router
