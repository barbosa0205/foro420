import CommentSchema from 'models/Comment'
import FeedPostSchema from 'models/FeedPost'
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

        if (body.type === 'feedComment') {
          const saveCommentInPost = await FeedPostSchema.findByIdAndUpdate(
            body.postId,
            {
              $push: {
                comments: comment._id,
              },
            }
          )
        } else {
          const saveCommentInPost = await PostSchema.findByIdAndUpdate(
            body.postId,
            {
              $push: {
                comments: comment._id,
              },
            }
          )
        }

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
        if (body.type === 'feedComment') {
          console.log(body.id, 'bodyId')
          const commentDeleted = await CommentSchema.deleteOne({
            _id: body.id,
          })
          console.log(commentDeleted, 'commentDeleted')
          const newComments = await CommentSchema.find({
            commentType: {
              $eq: body.type,
            },
          })
            .populate(['postedBy'])
            .sort({
              updatedAt: -1,
            })
          res.status(200).json({
            success: true,
            message: 'Comentario eliminado correctamente',
            newComments,
          })
        } else if (body.responses) {
          const comment = await CommentSchema.findOne({
            _id: body.id,
          })
          if (comment.responses.length) {
            //Eliminando comentario de Respuesta
            comment.responses.forEach(async (response) => {
              await CommentSchema.deleteOne({
                _id: response,
              })
            })
          }

          //Eliminando comentario principal
          const commentDeleted = await CommentSchema.deleteOne({
            _id: body.id,
          })

          const post = await PostSchema.findOne({
            _id: body.postId,
          }).populate('comments')

          let newComments = post.comments.filter(
            (c) => String(c._id) !== body.id
          )

          const commentsIds = newComments.map((comment) => comment._id)

          await PostSchema.findOneAndUpdate(
            {
              _id: body.postId,
            },
            {
              comments: commentsIds,
            }
          )
          const newPost = await PostSchema.findOne({
            _id: post._id,
          })

          let thisIsNewComments = await CommentSchema.find({
            _id: {
              $in: newPost.comments,
            },
          }).populate('postedBy')

          thisIsNewComments = await Promise.all(thisIsNewComments)

          //filtrar los que son respuesta

          thisIsNewComments = thisIsNewComments.filter(
            (c) => c.commentType !== 'response'
          )

          console.log('this is new comments', thisIsNewComments)

          res.status(200).json({
            success: true,
            message: 'Comentario eliminado correctamente',
            newComments: thisIsNewComments,
          })
        } else {
          const respDeleted = await CommentSchema.deleteOne({
            _id: body.id,
          })

          //delete RespId from Comment

          const comment = await CommentSchema.findOneAndUpdate(
            {
              _id: body.commentId,
            },
            {
              $pull: {
                responses: body.id,
              },
            }
          )

          console.log('id de respuesta eliminado de comentario')

          res.status(200).json({
            success: true,
            message: 'Respuesta eliminada correctamente',
          })
        }
      } catch (error) {
        console.log(error)
        return res.status(404).json({ success: false, message: error })
      }
      break
  }
}
