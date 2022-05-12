import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El titulo es requerido'],
    validate: {
      validator: (value) => value.length >= 5,
      message: 'El titulo debe tener al menos 5 caracteres',
    },
  },
  content: {
    type: String,
    required: [true, 'El contenido es requerido'],
    validate: {
      validator: (value) => value.length >= 10,
      message: 'El contenido debe tener al menos 10 caracteres',
    },
  },
  image: {
    type: String,
    required: [true, 'La imagen es requerida'],
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario es requerido'],
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'La categoria es requerida'],
  },
  type: {
    type: String,
    enum: ['POST', 'PREGUNTA'],
    default: 'POST',
  },
  comments: [
    {
      text: {},
      postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      createAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
      likes: {
        type: Number,
        default: 0,
      },
      dislikes: {
        type: Number,
        default: 0,
      },
    },
  ],
})
//cacheed
export default mongoose.models.Post || mongoose.model('Post', postSchema)
