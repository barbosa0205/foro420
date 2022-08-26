import useUser from 'contexts/useUser'
import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
export const socketContext = React.createContext()
const ENDPOINT =
  'localhost:3443' || 'https://foro420-socket-io-server.onrender.com/'

const SocketProvider = ({ children }) => {
  const { userF420 } = useUser()
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    if (userF420?._id) {
      const skt = io(ENDPOINT, {
        transports: ['websocket'],
        withCredentials: true,
        autoConnect: true,
      })
      setSocket(skt)
    }
  }, [userF420])

  const value = {
    io,
    socket,
  }

  return (
    <socketContext.Provider value={value}>{children}</socketContext.Provider>
  )
}

export default SocketProvider
