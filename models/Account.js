import mongoose, { Schema, model, models } from 'mongoose'

const AccountSchema = new Schema({
  provider: {
    type: String,
  },
  type: String,
  providerAccount_: String,
  access_token: String,
  expires_at: Number,
  scope: String,
  token_type: String,
  id_token: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
})
//cacheed
module.exports = models?.Account || model('Account', AccountSchema)
