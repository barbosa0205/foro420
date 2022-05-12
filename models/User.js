import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    default: '',
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
  createAt: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
    default:
      'https://th.bing.com/th/id/R.653f93c3cb58cb7f21b6a721ebdbec19?rik=dDXT3D3c%2bSRfNg&riu=http%3a%2f%2fwww.repol.copl.ulaval.ca%2fwp-content%2fuploads%2f2019%2f01%2fdefault-user-icon.jpg&ehk=5SV6bh5JXp3uM9swhors3LcaN1Iskv0xBV%2f7Hnq40s4%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1',
  },
})

export default mongoose.models.User || mongoose.model('User', userSchema)
