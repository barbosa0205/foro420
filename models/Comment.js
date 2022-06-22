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
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'El post es requerido'],
    },
    commentType: {
      type: String,
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
    likes: {
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
