import UserSchema from 'models/F420User'

export default async function handler(req, res) {
  const { method, query } = req
  switch (method) {
    case 'GET':
      try {
        console.log('f420_id', query.f420_id)
        const user = await UserSchema.findOne({
          _id: query.f420_id,
        })

        if (user.friends.includes(query.user_id)) {
          res.status(200).json({
            following: true,
          })
        }
      } catch (error) {
        console.error('ERROR AL OBTENER EL USUARIO', error)
      }

      break
  }
}
