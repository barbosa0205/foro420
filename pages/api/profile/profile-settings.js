import { dbConnect } from 'utils/mongoose'
import UserSchema from 'models/F420User'
const handler = async (req, res) => {
  await dbConnect()

  const { method, body, query } = req

  switch (method) {
    case 'PUT':
      try {
        const uid = query.uid
        const { image, username, fullname } = JSON.parse(body)

        await UserSchema.updateMany(
          {
            _id: uid,
          },
          {
            image,
            username,
            fullname,
            // email,
          }
        )

        res.status(200).json({
          success: true,
          message: 'Datos actualizados correctamente',
          data: {
            image,
            username,
            fullname,
            // email,
          },
        })
      } catch (error) {
        console.log(error)
        res.status(500).json({
          success: true,
          message: error,
        })
      }
      break
  }
}

export default handler
