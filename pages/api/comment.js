import CommentSchema from 'models/Comment'
import PostSchema from 'models/Post'
import UserSchema from 'models/F420User'
import mongoose, { mongo } from 'mongoose'
export default async function handler(req, res) {
  const { method, body } = req

  switch (method) {
    case 'POST':
      try {
        console.log('body', body)
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

        console.log('is valid?', mongoose.Types.ObjectId.isValid(comment._id))

        if (body.type === 'response') {
          comment.parentComment = body.parentComment

          let parentComment = await CommentSchema.findOne({
            _id: body.parentComment,
          })

          parentComment.responses.push(comment._id)
          await parentComment.save()
        }

        await comment.save()
        console.log('comment', comment)
        res.status(200).json(comment)
      } catch (error) {
        console.log(error)
      }

    case 'PUT':
      try {
        console.log('wasa')
        let commentEdited = await CommentSchema.findOneAndUpdate(
          {
            _id: body.id,
          },
          {
            content: body.content,
          }
        )
        console.log(commentEdited)
        res.status(200).json({
          success: true,
          message: 'Comentario editado correctamente',
          commentEdited,
        })
      } catch (error) {
        return res.status(404).json({ success: false, error: error })
      }
  }
}
