import React from 'react'
import { socketContext } from './SocketProvider'
const useSocket = () => {
  const contextValue = React.useContext(socketContext)
  return contextValue
}

export default useSocket
