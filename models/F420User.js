import { Schema, model, models } from 'mongoose'

const User = new Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: [true, 'El nombre de usuario es requerido'],
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
      validate: {
        validator: (value) => {
          //regex para validar que no sean caracteres especiales
          return /^[a-zA-Z0-9]+$/.test(value)
        },
        message: 'El nombre de usuario debe contener solo letras y numeros',
      },
    },
    email: {
      type: String,
      required: [true, 'El email es requerido'],
      unique: true,
      trim: true,
      validate: {
        validator: (value) => {
          //regex para validar que no sean caracteres especiales
          return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
            value
          )
        },
      },
    },
    image: {
      type: String,
    },
    cover: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    socket: String,

    postsLiked: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    cloudinary: {
      type: String,
    },
    postsSaved: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    postsFav: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    friends: [
      {
        type: String,
      },
    ],
    notifications: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Notification',
        default: [],
      },
    ],
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

export default models?.F420User || model('F420User', User)
