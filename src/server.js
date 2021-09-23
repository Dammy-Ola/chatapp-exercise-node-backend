const express = require('express')
const cookieSession = require('cookie-session')
const connectDB = require('../config/db')
const cors = require('cors')
const colors = require('colors')
const dotenv = require('dotenv')
const passport = require('passport')
const errorHandler = require('./middleware/error')

// Bringing in the route files
const auth = require('./routes/auth')
const channels = require('./routes/channels')
const messages = require('./routes/messages')

// Bringing in our environment variable file
dotenv.config({ path: './config/config.env' })

// Passport config
require('../config/passport')

// Connect to the database
connectDB()

// Initialiazing our app variable for express
const app = express()

// // Enabling cors
// const whitelist = [
//   process.env.CLIENT_ROUTE,
//   process.env.CLIENT_ROUTE_DEVELOPMENT,
// ]

const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? process.env.CLIENT_ROUTE
      : process.env.CLIENT_ROUTE_DEVELOPMENT,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   },
// }

app.use(cors(corsOptions))

// Express body parser
app.use(express.json())
app.set('trust proxy', 1)
app.use(
  cookieSession({
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    saveUninitialized: false,
    resave: false,
  })
)

// using passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Mouting or using the routes or routers
app.use('/api/v1/auth', auth)
app.use('/api/v1/channels', channels)
app.use('/api/v1/messages', messages)

// Using the errorHandler middleware
app.use(errorHandler)

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
