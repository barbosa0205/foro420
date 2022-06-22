import { dbConnect } from 'utils/mongoose'
import UserSchema from 'models/F420User'
const handler = async (req, res) => {
  await dbConnect()
  console.log(req.body.fullname)
  const { method, body, query } = req

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
      try {
        if (query.email) {
          const user = await UserSchema.findOne({
            email: query.email,
          })
          res.status(200).json(user)
        }
      } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error al obtener userF420' })
      }
      break
  }
}

export default handler
