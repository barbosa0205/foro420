import React from 'react'
import { messageContext } from './MessageProvider'
const useMessage = () => {
  const contextValue = React.useContext(messageContext)
  return contextValue
}

export default useMessage
