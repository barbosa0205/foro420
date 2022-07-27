import { dbConnect } from 'utils/mongoose'
import UserSchema from 'models/F420User'
import PostSchema from 'models/Post'
import CategorySchema from 'models/Category'
export default async function handler(req, res) {
  const { method, query } = req
  switch (method) {
    case 'GET':
      try {
        await dbConnect()
        let posts
        const category = await CategorySchema.findOne({
          name: query.category,
        })

        if (query.subcategory) {
          if (query.subcategory === 'todos') {
            posts = await PostSchema.find({
              category: category._id,
            })
              .populate('postedBy')
              .populate('category')
              .sort({ createdAt: -1 })
              .limit(30)
          } else {
            posts = await PostSchema.find({
              category: category._id,
              subcategory: query.subcategory,
            })
              .populate('postedBy')
              .populate('category')
              .sort({ createdAt: -1 })
              .limit(30)
          }
        }

        posts = JSON.parse(JSON.stringify(posts))
        console.log('posts:', posts.length)
        res.status(200).json({
          success: true,
          posts,
        })
      } catch (error) {
        console.log(error)
        res.status(500).json({
          success: false,
          message: error,
        })
      }
      break
  }
}
