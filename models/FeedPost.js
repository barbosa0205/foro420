import { Schema, model, models } from 'mongoose'

const FeedPostSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, 'El contenido es requerido'],
      minlength: [1, 'El contenido debe tener al menos 1 caracter'],
    },
    image: {
      type: [String],
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'F420User',
    },
    likes: {
      type: Number,
      default: 0,
    },

    type: {
      type: Schema.Types.ObjectId,
      ref: 'Type',
      required: [true, 'El tipo es requerido'],
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
)
//cacheed
module.exports = models?.FeedPost || model('FeedPost', FeedPostSchema)
