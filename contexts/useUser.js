import React from 'react'
import { userContext, userProvider } from './UserProvider'
const useUser = () => {
  const contextValue = React.useContext(userContext)
  return contextValue
}

export default useUser
