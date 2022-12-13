import UserSchema from 'models/F420User'
import PostSchema from 'models/FeedPost'
const handler = async (req, res) => {
  const { method, query, body } = req
  switch (method) {
    case 'PUT':
      try {
        const user = await UserSchema.findOne({
          _id: query.uid,
        })

        let postsLiked = user.feedPostsLiked
        console.log('postsLiked', postsLiked)

        if (!postsLiked.includes(query.id)) {
          console.log('query.id', query.id)
          await UserSchema.findOneAndUpdate(
            {
              _id: query.uid,
            },
            {
              $push: {
                feedPostsLiked: query.id,
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
              feedPostsLiked: newPostsLiked,
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
        res.status(500).json({ message: 'Error al dar me gusta a feedPost' })
      }
  }
}

export default handler
