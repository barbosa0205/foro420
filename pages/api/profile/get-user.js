import UserSchema from 'models/F420User'
export default async function handler(req, res) {
  const { method, query } = req

  switch (method) {
    case 'GET':
      try {
        const user = await UserSchema.findOne({
          _id: query.uid,
        })
        console.log('userrrrrr', user)
        return res.status(200).json({
          success: true,
          user,
        })
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'no se pudo obtener el usuario',
        })
      }
  }
}
