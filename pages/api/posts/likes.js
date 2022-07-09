import PostSchema from 'models/Post'
import UserSchema from 'models/F420User'
import { info } from 'autoprefixer'
export default async function handler(req, res) {
  const { method, query } = req
  switch (method) {
    case 'PUT':
      try {
        const user = await UserSchema.findOne({
          _id: query.uid,
        })
        const postsLiked = user.postsLiked
        if (!postsLiked.includes(query.id)) {
          await UserSchema.findOneAndUpdate(
            {
              _id: query.uid,
            },
            {
              $push: {
                postsLiked: query.id,
              },
            }
          )

          await PostSchema.findOneAndUpdate(
            {
              _id: query.id,
            },
            {
              $inc: {
                likes: 1,
              },
            }
          )
          res.status(200).json({
            success: true,
            isLiked: true,
            newLikes: Number(query.likes) + 1,
          })
        } else {
          const newPostsLiked = postsLiked.filter((id) => id === query.id)

          await UserSchema.findOneAndUpdate(
            {
              _id: query.uid,
            },
            {
              postsLiked: newPostsLiked,
            }
          )

          await PostSchema.findOneAndUpdate(
            {
              _id: query.id,
            },
            {
              $inc: {
                likes: -1,
              },
            }
          )

          res.status(200).json({
            success: true,
            isLiked: false,
            newLikes: Number(query.likes) - 1,
          })
        }
      } catch (error) {
        console.error(error)
      }
      break
  }
}
