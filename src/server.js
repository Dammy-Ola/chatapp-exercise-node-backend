const express = require('express')
const dotenv = require('dotenv')
const colors = require('colors')
const connectDB = require('../config/db')

// Bringing in our environment variable file
dotenv.config({ path: './config/config.env' })

// Connect to the database
connectDB()

// Initialiazing our app variable for express
const app = express()

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
