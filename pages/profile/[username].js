import React, { useEffect } from 'react'
import UserSchema from 'models/F420User'
import { dbConnect } from 'utils/mongoose'
import { getSession } from 'next-auth/react'
import useUser from 'contexts/useUser'
import { useRouter } from 'next/router'
import UserProfile from 'components/UserProfile'
import UserF420Profile from 'components/UserF420Profile'
const Profile = ({ userF420, userSession }) => {
  const { setUserData, setUserF420 } = useUser()
  const router = useRouter()
  useEffect(() => {
    setUserData(userSession)
    setUserF420(userF420)
  }, [userSession, setUserData])

  return (
    <div className='w-full min-h-screen mx-auto'>
      {router.query.username === userF420.username ? (
        <div>
          <UserF420Profile />
        </div>
      ) : (
        <div>
          <UserProfile />
        </div>
      )}
    </div>
  )
}

export default Profile

export const getServerSideProps = async (context) => {
  try {
    await dbConnect()
    let session = await getSession(context)
    if (!session?.user) {
      //redirect to login
      context.res.writeHead(302, { Location: '/login' })
      context.res.end()
    }

    const userSession = session.user

    let userF420 = await UserSchema.findOne({
      email: session.user.email,
    })
    userF420 = JSON.parse(JSON.stringify(userF420))
    console.log(userF420)

    //verify if query username exists
    const usernameQuery = context.query.username
    const userExist = await UserSchema.findOne({ username: usernameQuery })
    if (!userExist) {
      //redirect user to home
      context.res.writeHead(302, {
        Location: '/',
      })
      context.res.end()
    }

    return {
      props: {
        userF420,
        userSession,
      },
    }
  } catch (error) {
    console.error(error)
    return {
      props: {},
    }
  }
}
