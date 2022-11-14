import CommentSchema from 'models/Comment'
import UserSchema from 'models/F420User'
export default async function handler(req, res) {
  const { method, query } = req
  switch (method) {
    case 'GET':
      try {
        if (query.task === 'getallresponses') {
          const comment = await CommentSchema.findById(
            query.commentId
          ).populate('responses')
          let responses = comment.responses.map(async (respId) => {
            let response = await CommentSchema.findById(respId)

            const postedBy = await UserSchema.findById(response.postedBy)

            response.postedBy = postedBy

            return response
          })

          responses = await Promise.all(responses)

          console.log(responses)

          return res.status(200).json({
            responses,
          })
        }
      } catch (error) {
        console.error('ERROR AL OBTENER AMIGO', error)
      }

      break
  }
}
