import { Schema, model, models } from 'mongoose'

const NotificationSchema = new Schema(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: 'F420User',
      required: true,
    },
    notification: {
      type: String,
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
    icon: {
      type: String,
    },
    pendientToView: {
      type: Boolean,
      default: true,
    },
    notifyWatched: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
)
//cacheed
module.exports =
  models?.Notification || model('Notification', NotificationSchema)
