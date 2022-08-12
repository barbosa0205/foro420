import UserSchema from 'models/F420User'
async function handler(req, res) {
  const { method, query } = req

  switch (method) {
    case 'PUT':
      try {
        const socketUpdated = await UserSchema.findOneAndUpdate(
          {
            _id: query.uid,
          },
          {
            socket: query.socketId,
          }
        )

        res.status(200).json({
          success: true,
          message: ' socket updated',
          socket: query.socketId,
        })
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'no se pudo guardar el socket',
        })
      }
      break
  }
}

export default handler
