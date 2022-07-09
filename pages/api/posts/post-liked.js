import UserSchema from 'models/F420User'

export default async function handler(req, res) {
  const { query, method } = req

  switch (method) {
    case 'GET':
      try {
        const user = await UserSchema.findOne({
          _id: query.uid,
        })

        const userLikePost = user.comments.find((id) => id === query.id)

        res.status(200).json({ success: true, postLiked: userLikePost })
      } catch (error) {
        console.log('error', error)
        res.status(500).json({
          success: false,
          message: 'Error al obtener si le gusta el post',
        })
      }
      break
  }
}
