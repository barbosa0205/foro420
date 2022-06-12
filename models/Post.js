import { Schema, model, models } from 'mongoose'

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'El titulo es requerido'],
      minlength: [5, 'El titulo debe tener al menos 5 caracteres'],
      maxlength: [50, 'El titulo debe tener como maximo 50 caracteres'],
    },
    content: {
      type: String,
      required: [true, 'El contenido es requerido'],
      minlength: [10, 'El contenido debe tener al menos 10 caracteres'],
      maxlength: [2000, 'El contenido debe tener como maximo 2000 caracteres'],
    },
    image: {
      type: String,
      required: [true, 'La imagen es requerida'],
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'F420User',
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'La categoria es requerida'],
    },
    subcategory: {
      type: String,
      default: null,
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
      },
    ],
  },
  {
    timestamps: true,
  }
)
//cacheed
module.exports = models?.Post || model('Post', PostSchema)
