import CommentSchema from 'models/Comment'
export default async function handelr(req, res) {
  const { method, query } = req

  switch (method) {
    case 'GET':
      try {
        const comments = await CommentSchema.find({
          postedBy: {
            $eq: query.id,
          },
          commentType: {
            $eq: 'feedComment',
          },
        })
          .limit(query.qty)
          .sort({
            updatedAt: -1,
          })
          .populate(['postedBy'])

        res.status(200).json(comments)
      } catch (err) {
        res.status(500).json({
          success: false,
          message: err.message,
        })
      }
      break
  }
}
