const mongoose = require('mongoose')
const colors = require('colors')

const connectDB = async () => {
  console.log(process.env.MONGO_URI_LOCAL)
  const DB_URI =
    process.env.NODE_ENV === 'production'
      ? process.env.MONGO_URI
      : process.env.MONGO_URI_LOCAL
  const conn = await mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  console.log(`MongoDB: ${conn.connection.host}`.cyan.bold)
}

module.exports = connectDB
