import dbConnect from 'utils/mongoose'
import UserSchema from 'models/F420User'
export const getUserByEmail = async ({ email }) => {
  await dbConnect()
  const user = await UserSchema.findOne({ email })
  console.log(user)
}
