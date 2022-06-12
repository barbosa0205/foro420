import { Schema, model, models } from 'mongoose'

const CommentSchema = new Schema(
  {
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'F420User',
    },
    content: {
      type: String,
      required: [true, 'El contenido es requerido'],
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    responses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    timestamps: true,
  }
)
//cacheed
module.exports = models?.Comment || model('Comment', CommentSchema)
