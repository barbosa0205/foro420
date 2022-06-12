import UserSchema from 'models/F420User'
import CategorySchema from 'models/Category'
import PostSchema from 'models/Post'

const handler = async (req, res) => {
  try {
    const { method, query } = req
    switch (method) {
      case 'GET':
        try {
          switch (query.type) {
            case 'question':
              const question = await PostSchema.find({
                postedBy: query.id,
                type: '6299b5e9086e49fa5c27f861',
              }).limit(query.limit)

              const questionData = question.map(async (question) => {
                const postedBy = await UserSchema.findById(question.postedBy)
                const category = await CategorySchema.findById(
                  question.category
                )
                question.postedBy = postedBy
                question.category = category
                return question
              })
              console.log('question', question)
              await Promise.all(questionData)

              res.status(200).json({
                question,
              })
              break

            default:
              const posts = await PostSchema.find({
                postedBy: query.id,
                type: {
                  $eq: '6299b5c4086e49fa5c27f860',
                },
              }).limit(query.limit)
              const postsData = posts.map(async (post) => {
                const postedBy = await UserSchema.findById(post.postedBy)
                const category = await CategorySchema.findById(post.category)
                post.postedBy = postedBy
                post.category = category
                return post
              })
              await Promise.all(postsData)

              res.status(200).json({
                posts,
              })
          }
        } catch (error) {
          return res.status(404).json({ success: false, error: error })
        }
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al actualizar el nombre' })
  }
}

export default handler
