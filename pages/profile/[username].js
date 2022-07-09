import React, { useEffect } from 'react'

import useUser from 'contexts/useUser'
import { useRouter } from 'next/router'
import UserProfile from 'components/UserProfile'
import UserF420Profile from 'components/UserF420Profile'
import { getSession } from 'next-auth/react'
import UserSchema from 'models/F420User'
import PostSchema from 'models/Post'
const Profile = () => {
  const { setUserData, userF420, setUserF420 } = useUser()
  const router = useRouter()

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
