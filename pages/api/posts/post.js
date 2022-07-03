import PostSchema from 'models/Post'
import CommentSchema from 'models/Comment'
export default async function handler(req, res) {
  const { method, query, body } = req
  switch (method) {
    case 'DELETE':
      try {
        const post = await PostSchema.findById(query.id)
        let comments = post.comments
        console.log('comments', comments)
        comments.forEach(async (comment) => {
          let commentContent = await CommentSchema.findOne({
            _id: comment,
          })

          if (commentContent.responses.length) {
            commentContent.responses.forEach(async (response) => {
              await CommentSchema.deleteOne({
                _id: response,
              })
            })
          }
          const commentDeleted = await CommentSchema.deleteOne({
            _id: commentContent._id,
          })
          console.log('commentDeleted', commentDeleted)
        })
        const postDeleted = await PostSchema.deleteOne({
          _id: query.id,
        })

        res.status(200).send({
          succes: true,
          message: 'Post eliminado correctamente',
        })
      } catch (error) {
        console.log('ERROR AL OBTENER POST', error)
        return res.status(500).json({ message: 'Error al obtener el post' })
      }
      break

    case 'PUT':
      try {
        const postToEdit = await PostSchema.findOneAndUpdate(
          {
            _id: body.data.id,
          },
          {
            ...body.data,
          }
        )
        res.status(200).json({
          success: true,
        })
      } catch (error) {
        console.log('ERROR AL OBTENER POST', error)
        return res.status(500).json({ message: 'Error al obtener el post' })
      }
      break
  }
}
