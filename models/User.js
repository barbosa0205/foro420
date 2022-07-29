import mongoose, { Schema, model, models } from 'mongoose'

const UserAccountSchema = new Schema({
  name: String,
  email: String,
  image: String,
  emailVerified: Boolean,
})
//cacheed
module.exports = models?.User || model('User', UserAccountSchema)
