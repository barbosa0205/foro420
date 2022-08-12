import CommentSchema from 'models/Comment'
import PostSchema from 'models/Post'
import UserSchema from 'models/F420User'
import mongoose, { mongo } from 'mongoose'
export default async function handler(req, res) {
  const { method, body } = req

  switch (method) {
    case 'POST':
      try {
        let comment = await new CommentSchema({
          postedBy: body.postedBy,
          content: body.content,
          post: body.postId,
          commentType: body.type,
        })

        const saveCommentInPost = await PostSchema.findByIdAndUpdate(
          body.postId,
          {
            $push: {
              comments: comment._id,
            },
          }
        )

        comment.postedBy = await UserSchema.findById(comment.postedBy)

        if (body.type === 'response') {
          comment.parentComment = body.parentComment

          let parentComment = await CommentSchema.findOne({
            _id: body.parentComment,
          })

          parentComment.responses.push(comment._id)
          await parentComment.save()
        }

        await comment.save()

        res.status(200).json(comment)
      } catch (error) {
        console.log(error)
        res.status(404).json({
          success: false,
          error,
        })
      }
      break

    case 'PUT':
      try {
        let commentEdited = await CommentSchema.findOneAndUpdate(
          {
            _id: body.id,
          },
          {
            content: body.content,
          }
        )

        res.status(200).json({
          success: true,
          message: 'Comentario editado correctamente',
          commentEdited,
        })
      } catch (error) {
        return res.status(404).json({ success: false, error: error })
      }
      break
    case 'DELETE':
      try {
        if (body.responses) {
          const comment = await CommentSchema.findOne({
            _id: body.id,
          })
          if (comment.responses.length) {
            comment.responses.forEach(async (response) => {
              await CommentSchema.deleteOne({
                _id: response,
              })
            })
          }
          const commentDeleted = await CommentSchema.deleteOne({
            _id: body.id,
          })

          const post = await PostSchema.findOne({
            _id: body.postId,
          })

          const newComments = post.comments.filter((c) => c === body.id)

          await PostSchema.findOneAndUpdate(
            {
              _id: body.postId,
            },
            {
              comments: newComments,
            }
          )
          res.status(200).json({
            success: true,
            message: 'Comentario eliminado correctamente',
          })
        } else {
          const comment = await CommentSchema.findOne({
            _id: body.commentId,
          })
          let responses = comment.responses

          responses = responses.filter((r) => {
            return body.id !== r.toString()
          })

          const newResps = await CommentSchema.findOneAndUpdate(
            {
              _id: body.commentId,
            },
            {
              responses: responses,
            }
          )

          let commentDeleted = await CommentSchema.deleteOne({
            _id: body.id,
          })
          res.status(200).json({
            success: true,
            message: 'Respuesta eliminada correctamente',
            responses,
          })
        }
      } catch (error) {
        console.log(error)
        return res.status(404).json({ success: false, message: error })
      }
      break
  }
}
