const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../src/models/User')

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, cb) => {
      const newUser = {
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        avatar: profile.photos[0].value,
      }

      let user = await User.findOne({ email: profile.emails[0].value })

      if (user) {
        cb(null, user)
        console.log(`Existing User: ${user}`)
      } else {
        user = await User.create(newUser)
        cb(null, user)
        console.log(`New User: ${user}`)
      }
    }
  )
)

passport.serializeUser((user, cb) => {
  cb(null, user.id)
  console.log(`Serialize ${user}`)
  console.log(`This is the Serialize user id: ${user.id}`)
})

passport.deserializeUser(async (id, cb) => {
  console.log(`This is the id: ${id}`)
  user = await User.findById(id, (err, user) => cb(err, user))
  console.log(`deserialize ${user}`)
})
