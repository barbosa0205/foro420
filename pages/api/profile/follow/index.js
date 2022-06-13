import UserSchema from 'models/F420User'
import { Server } from 'socket.io'
const handler = async (req, res) => {
  const { method, query, body } = req
  switch (method) {
    case 'GET':
      try {
        res.status(200).json({
          message: 'Hola',
        })
      } catch (error) {
        console.error('ERROR AL OBTENER AL USUARIO', error)
      }
      break
    case 'PUT':
      try {
        const { following } = body
        const user = await UserSchema.findOneAndUpdate(
          {
            _id: query.id,
          },
          {
            $push: {
              friends: following,
            },
          }
        )
        console.log('user', user)
        res.status(200).json({
          message: 'Siguiendo a este usuario',
          following: true,
        })
      } catch (error) {
        console.error('ERROR AL SEGUIR AL USUARIO', error)
      }

      break
  }
}

export default handler
