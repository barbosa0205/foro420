import { Schema, model, models } from 'mongoose'

const CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    unique: true,
  },
  subcategories: {
    type: [String],
    default: [],
  },
})
//cacheed
module.exports = models?.Category || model('Category', CategorySchema)
