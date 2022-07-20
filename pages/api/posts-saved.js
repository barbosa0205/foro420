import UserSchema from 'models/F420User'
import PostSchema from 'models/Post'
import CategorySchema from 'models/Category'
import TypeSchema from 'models/Type'
import { dbConnect } from 'utils/mongoose'
export default async function handler(req, res) {
  const { method, query } = req

  switch (method) {
    case 'GET':
      try {
        await dbConnect()
        const postsIds = Array(query.posts)
        if (postsIds.length > 0) {
          const postsPromise = postsIds.map(async (id) => {
            let post = await PostSchema.findOne({
              _id: id,
            })
            post.category = await CategorySchema.findOne({
              _id: post.category,
            })
            post.type = await TypeSchema.findOne({
              _id: post.type,
            })
            post.postedBy = await UserSchema.findOne({
              _id: post.postedBy,
            })

            return post
          })
          const posts = await Promise.all(postsPromise)
          res.status(200).json({
            success: true,
            postsSaved: posts,
          })
        } else {
          res.status(404).json({
            success: false,
            message: 'no tiene posts guardados',
          })
        }
      } catch (error) {
        console.log(error)
        res.status(500).send(error)
      }
      break
  }
}
