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
    icon: {
      type: String,
    },
    pendientToView: {
      type: Boolean,
      default: true,
    },
    NotifyWatched: {
      type: Boolean,
      default: true,
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
