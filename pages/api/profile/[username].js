import { dbConnect } from 'utils/mongoose'
import UserSchema from 'models/F420User'
const handler = async (req, res) => {
  try {
    await dbConnect()
    console.log(req.body.fullname)
    const { method, body } = req

    switch (method) {
      case 'PUT':
        if (body.fullname) {
          await UserSchema.findOneAndUpdate(
            { _id: body.id },
            { fullname: body.fullname }
          )
          res.status(200).json({ message: 'Nombre actualizado' })
        }
        break

      case 'GET':
        res.status(200).json({ message: 'Hola' })
        break
    }
  } catch (error) {
    console.error('ERR0RRRR', error)
    res.status(500).json({ message: 'Error al actualizar el nombre' })
  }
}

export default handler
