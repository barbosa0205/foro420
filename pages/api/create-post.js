import PostSchema from 'models/Post'
import { dbConnect } from 'utils/mongoose'

export default async function handler(req, res) {
  await dbConnect()
  const { method, body } = req
  switch (method) {
    case 'POST':
      try {
        const post = await new PostSchema(body)
        // const postSaved = await post.save()
        post.save()
        return res.status(200).json({ success: true, post: 'postSaved' })
      } catch (error) {
        return res.status(404).json({ success: false, error: error })
      }
  }
}
