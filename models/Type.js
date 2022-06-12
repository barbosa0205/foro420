import { Schema, model, models } from 'mongoose'

const TypeSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    unique: true,
  },
})
//cacheed
module.exports = models?.Types || model('Types', TypeSchema)
