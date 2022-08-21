import { privateRoutes } from 'helpers/privateRoutes'
import { useSession, signOut } from 'next-auth/react'
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
  const [pendientNotifications, setPendientNotifications] = React.useState([])
  const [showNotificationsSide, setShowNotificationsSide] =
    React.useState(false)
  const [newNotificationAlert, setNewNotificationAlert] = React.useState(null)

  const setUserData = (userData) => setUserSignInfo(userData)

  const checkIfTheSessionExpired = async () => {
    try {
      if (status === 'loading') return
      if (
        status === 'unauthenticated' &&
        privateRoutes.includes(router.asPath)
      ) {
        setUserF420({})
        setUserSignInfo({})
        router.replace('/login')
      }
      if (status === 'authenticated') {
        const resp = await fetch(`/api/session?email=${session.user.email}`, {
          'content-type': 'application/json',
        })
        const data = await resp.json()
        if (data.success) {
          if (localStorage.getItem('foro420-session-expires_at')) {
            if (
              localStorage.getItem('foro420-session-expires_at') <
              String(new Date())
            ) {
              localStorage.removeItem('foro420-session-expires_at')
              signOut()
            }
          } else {
            localStorage.setItem('foro420-session-expires_at', data.expires_at)
          }
        }
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const getUserSession = async () => {
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
    checkIfTheSessionExpired()
    getUserSession()
      .then(() => {})
      .catch((error) => {
        console.log('error: ', error)
      })
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
    pendientNotifications,
    setPendientNotifications,
    showNotificationsSide,
    setShowNotificationsSide,
    newNotificationAlert,
    setNewNotificationAlert,
  }

  return <userContext.Provider value={value}>{children}</userContext.Provider>
}

export default UserProvider
