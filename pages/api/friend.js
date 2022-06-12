import UserSchema from 'models/F420User'

const handler = async (req, res) => {
  const { method, query } = req
  switch (method) {
    case 'GET':
      try {
        const friend = await UserSchema.findOne({
          _id: query.id,
        })

        res.status(200).json({
          friend,
        })
      } catch (error) {
        console.error('ERROR AL OBTENER AMIGO', error)
      }

      break
  }
}

export default handler
