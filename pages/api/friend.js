import UserSchema from 'models/F420User'

export default async function handler(req, res) {
  const { method, query } = req
  switch (method) {
    case 'GET':
      try {
        const user = await UserSchema.findOne({
          _id: query.uid,
        }).populate({
          path: 'friends',
        })

        const friends = await Promise.all(
          user.friends.map(
            async (friend) => await UserSchema.findOne({ _id: friend })
          )
        )

        console.log('user on friends api', friends)

        res.status(200).json({
          success: true,
          friends,
        })
      } catch (error) {
        console.error('ERROR AL OBTENER AMIGO', error)
      }

      break
  }
}
