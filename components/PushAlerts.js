import useSocket from 'contexts/socket/useSocket'
import useUser from 'contexts/useUser'
import { getPendientNotifications } from 'helpers/notifications'
import { saveSocket } from 'helpers/socket'

import React, { useEffect } from 'react'

const PushAlerts = () => {
  const { socket } = useSocket()
  const {
    userF420,
    setPendientNotifications,
    newNotificationAlert,
    setNewNotificationAlert,
  } = useUser()

  const getSocket = async (socketId) => {
    const socket = await saveSocket(socketId, userF420._id)
    console.log('socket', socket)
  }

  useEffect(() => {
    if (socket) {
      socket.on('connected', (socketId) => {
        getSocket(socketId)
      })
      socket.on('verifyAlerts', async (saludo) => {
        const pendientNotifies = await getPendientNotifications({
          uid: userF420._id,
        })
        if (pendientNotifies?.notificationsPendients?.length) {
          setPendientNotifications(pendientNotifies.notificationsPendients)
        }
      })
      socket.on('notification', async (data) => {
        const pendientNotifies = await getPendientNotifications({
          uid: userF420._id,
        })
        if (pendientNotifies?.notificationsPendients?.length) {
          setPendientNotifications(pendientNotifies.notificationsPendients)
        }
        setNewNotificationAlert(data)
      })
    }
  }, [socket])

  return <div></div>
}

export default PushAlerts
