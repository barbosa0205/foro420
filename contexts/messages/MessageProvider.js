import useUser from 'contexts/useUser'
import React, { useEffect, useState } from 'react'

export const messageContext = React.createContext()

const MessageProvider = ({ children }) => {
  const { userF420 } = useUser()

  const [openMessages, setOpenMessages] = useState(false)
  const [userChats, setUserChats] = useState([])
  const toggleMessages = () => setOpenMessages(!openMessages)

  const value = {
    openMessages,
    toggleMessages,
  }

  return (
    <messageContext.Provider value={value}>{children}</messageContext.Provider>
  )
}

export default MessageProvider
