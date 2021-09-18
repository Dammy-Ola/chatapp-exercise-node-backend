const express = require('express')
const dotenv = require('dotenv')
const colors = require('colors')
const connectDB = require('../config/db')

// Bringing in the route files
const channels = require('./routes/channels')
const messages = require('./routes/messages')

// Bringing in our environment variable file
dotenv.config({ path: './config/config.env' })

// Connect to the database
connectDB()

// Initialiazing our app variable for express
const app = express()

// Mouting or using the routes or routers
app.use('/api/v1/channels', channels)
app.use('/api/v1/messages', messages)

const PORT = process.env.PORT || 5000

const server = app.listen(
  PORT,
  console.log(
    `App runing in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)

// Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`)
  // close server & exit process
  server.close(() => process.exit(1))
})
