import UserSchema from 'models/F420User'

export default async function handler(req, res) {
  const { method, query } = req

  switch (method) {
    case 'GET':
      try {
        const user = await UserSchema.findOne({
          _id: query.uid,
        })

        let likedPost = false
        let savedPost = false

        const likedPosts = user.postsLiked
        const savedPosts = user.postsSaved

        if (likedPosts) {
          likedPost = likedPosts.includes(query.id)
        }
        if (savedPosts) {
          savedPost = savedPosts.includes(query.id)
        }

        res.status(200).json({ success: true, likedPost, savedPost })
      } catch (error) {
        console.log(error)
      }
      break
  }
}
