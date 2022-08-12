import useSocket from 'contexts/socket/useSocket'
import useUser from 'contexts/useUser'
import { getPendientNotifications } from 'helpers/notifications'
import { saveSocket } from 'helpers/socket'

import React, { useEffect } from 'react'

const PushAlerts = () => {
  const { socket } = useSocket()
  const { userF420 } = useUser()

  const getSocket = async (socketId) => {
    const socket = await saveSocket(socketId, userF420._id)
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
      })
    }
  }, [socket])

  return <div></div>
}

export default PushAlerts
