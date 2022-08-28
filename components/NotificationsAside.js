import useUser from 'contexts/useUser'
import { getAllNotifications } from 'helpers/notifications'
import React, { useEffect } from 'react'
import { NotificationCard } from './NotificationCard'
import LoadingImage from 'assets/loader.gif'
import Image from 'next/image'
export const NotificationsAside = () => {
  const { userF420, pendientNotifications, setPendientNotifications } =
    useUser()
  const [allNotifications, setAllNotifications] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  const getNotifications = async () => {
    setLoading(true)
    const notifications = await getAllNotifications(userF420._id)
    if (notifications.success) {
      console.log('notification', notifications)
      setAllNotifications(notifications.notifications)
      setLoading(false)
    }
  }

  useEffect(() => {
    getNotifications()
    if (!allNotifications.length) {
      setLoading(false)
    }
    return () => {
      setAllNotifications([])
    }
  }, [])

  useEffect(() => {
    if (allNotifications.length) {
      // colocamos las notificaciones con la porpiedad notifyWatched en true
      ;(async () => {
        try {
          const resp = await fetch(
            '/api/notifications?method=markAsNotifyWatched',
            {
              method: 'PUT',
            }
          )
          const data = await resp.json()
          if (data.success) {
            setPendientNotifications([])
          }
        } catch (error) {
          console.log('no se pudo poner como')
        }
      })()
    }
  }, [allNotifications])

  return (
    <aside
      onClick={(e) => e.stopPropagation()}
      className={`w-1/2 min-w-fit max-w-md min-h-screen bg-gray-50 shadow-gray-400 shadow-lg overflow-y-scroll`}
    >
      <h3 className='text-4xl'>Notificaciones</h3>
      <section>
        {allNotifications.length
          ? allNotifications.map((notify) => (
              <NotificationCard
                notify={notify}
                key={notify._id}
                allNotifications={allNotifications}
                setAllNotifications={setAllNotifications}
              />
            ))
          : !loading && <p>No tienes notificaciones</p>}

        {loading && (
          <Image width={100} height={100} src={LoadingImage} alt='loading' />
        )}
      </section>
    </aside>
  )
}
