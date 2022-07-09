import UserSchema from 'models/F420User'
import PostSchema from 'models/Post'

export default async function handler(req, res) {
  const { method, query } = req

  switch (method) {
    case 'PUT':
      try {
        const user = await UserSchema.findOne({
          _id: query.uid,
        })

        const postSaved = user.postsSaved.includes(query.id)

        if (!postSaved) {
          const savePost = await UserSchema.findOneAndUpdate(
            {
              _id: query.uid,
            },
            {
              $push: {
                postsSaved: query.id,
              },
            }
          )
          res.status(200).json({
            success: true,
            postSaved: savePost,
          })
        } else {
          const newPostsSaved = user.postsSaved.filter((id) => id === query.id)
          await UserSchema.findOneAndUpdate(
            {
              _id: query.uid,
            },
            {
              postsSaved: newPostsSaved,
            }
          )
          res.status(200).json({
            success: true,
            postUnsaved: true,
          })
        }
      } catch (error) {
        console.error(error)
      }
      break
  }
}
