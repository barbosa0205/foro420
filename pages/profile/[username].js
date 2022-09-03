import useUser from 'contexts/useUser'

import UserF420Profile from 'components/UserF420Profile'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
const Profile = () => {
  const { setUserData, userF420, setUserF420 } = useUser()
  const router = useRouter()
  const [userProfile, setUserProfile] = useState(null)
  useEffect(() => {
    ;(async () => {
      if (router.query.id) {
        try {
          const resp = await fetch(
            `/api/profile/get-user?uid=${router.query.id}`
          )
          const userData = await resp.json()
          if (userData.success) {
            setUserProfile(userData.user)
          }
        } catch (error) {
          console.log(error)
        }
      }
    })()
  }, [router.query.id])

  return (
    <div className='w-full min-h-screen mx-auto'>
      <div>
        <UserF420Profile user={userProfile} />
      </div>
    </div>
  )
}

export default Profile
