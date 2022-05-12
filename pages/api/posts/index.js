import { dbConnect } from '../../../utils/mongoose'
import PostSchema from '../../../models/Post'
dbConnect()

export default async function handler(req, res) {
  await dbConnect()
  //POST api/post
  const { method } = req
  switch (method) {
    case 'POST':
      try {
        const post = new PostSchema(req.body)
        await post.save()

        return res.status(200).json({ success: true, post })
      } catch (error) {
        return res
          .status(404)
          .json({ success: false, error: 'Falla al crear el post' })
      }
    default:
      return res
        .status(500)
        .json({ succes: false, error: 'Falla en el servidor' })
  }
}
