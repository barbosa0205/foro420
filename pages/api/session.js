import UserSchema from 'models/F420User'
import AccountSchema from 'models/Account'
import UserAccountSchema from 'models/User'
import mongoose from 'mongoose'
import { dbConnect } from 'utils/mongoose'

const handler = async (req, res) => {
  await dbConnect()
  const { method, body, query } = req

  switch (method) {
    case 'GET':
      try {
        const user = await UserAccountSchema.findOne({
          email: query.email,
        })

        console.log('user', user)

        const account = await AccountSchema.find({
          userId: user._id,
        })

        return res.status(200).json({
          success: true,
          expires_at: String(
            new Date(new Date().getTime(account.expires_at) + 15 * 60 * 1000)
          ),
        })
      } catch (error) {
        console.log('error al verificar si la sesion del usuario caduco', error)
      }
      break
  }
}

export default handler
