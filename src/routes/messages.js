const express = require('express')
const {
  getMessages,
  createMessage,
  getMessage,
} = require('../controllers/messages')

const router = express.Router()

router.route('/').get(getMessages).post(createMessage)
router.route('/:id').get(getMessage)

module.exports = router
