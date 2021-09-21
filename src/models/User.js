const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'The Name is required'],
    },
    email: {
      type: String,
      required: [true, 'The Email is required'],
      unique: [true, 'This Email already existed'],
      match: [
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      minlength: 6,
      select: false,
      required: [true, 'The password field is required'],
    },
    // googleId: {
    //   type: String,
    //   required: true,
    // },
    // avatar: {
    //   type: String,
    //   required: true,
    // },
  },
  {
    timestamps: true,
  }
)

// Encrypting the password before saving the user
UserSchema.pre('save', async function (next) {
  // We only want to hash the password when the user registers and changes his password, that is modify his password, else skip (next)
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Matching the password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', UserSchema)
