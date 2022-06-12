import { dbConnect } from 'utils/mongoose'
import UserSchema from 'models/F420User'
import Cors from 'cors'

const cors = Cors({
  methods: ['POST'],
})

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

export default async function handler(req, res) {
  await runMiddleware(req, res, cors)
  await dbConnect()

  const { method, body } = req
  switch (method) {
    case 'POST':
      try {
        const newUser = new UserSchema(body)
        const userSaved = await newUser.save()
        console.log(userSaved)
        return res.status(200).json({ success: true, user: 'userSaved' })
      } catch (error) {
        return res.status(404).json({ success: false, error: error })
      }
  }
}
