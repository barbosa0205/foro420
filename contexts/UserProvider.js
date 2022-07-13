import { privateRoutes } from 'helpers/privateRoutes'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

export const userContext = React.createContext()

const UserProvider = ({ children }) => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [userSignInfo, setUserSignInfo] = React.useState({})
  const [userF420, setUserF420] = React.useState({})
  const [notify, setNotify] = React.useState('')
  const [notifies, setNotifies] = React.useState([])
  const setUserData = (userData) => setUserSignInfo(userData)

  const getUserSession = async () => {
    console.log('router.asPath', router.asPath)
    if (status === 'loading') return
    if (status === 'authenticated') {
      setUserData(session.user)
      //get userF420 from db by fetching
      const resp = await fetch(
        `/api/profile/username?email=${session.user.email}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const data = await resp.json()
      if (!data?._id && router.asPath !== '/login') {
        router.replace('/welcome')
      }
      setUserF420(data)
    }
    if (status === 'unauthenticated' && privateRoutes.includes(router.asPath)) {
      setUserF420({})
      setUserSignInfo({})
      router.replace('/login')
    }
  }

  useEffect(() => {
    getUserSession()
  }, [status])

  useEffect(() => {
    if (status === 'authenticated' && !userF420?._id) {
      router.replace('/welcome')
    }
  }, [userF420])

  const value = {
    user: userSignInfo,
    userF420,
    setUserF420,
    setUserData,
    notifies,
    setNotifies,
    notify,
    setNotify,
  }

  return <userContext.Provider value={value}>{children}</userContext.Provider>
}

export default UserProvider
