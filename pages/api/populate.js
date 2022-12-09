import FeedPostSchema from 'models/FeedPost'

export default async function handler(req, res) {
  const { method, query } = req
  try {
    switch (method) {
      case 'GET':
        const data = await FeedPostSchema.findById(query.id).populate(
          'postedBy'
        )
        console.log('data aqiiii!!!', data)
        res.status(200).json(data)
        break
    }
  } catch (error) {
    console.log('error to populate', error)
  }
}
