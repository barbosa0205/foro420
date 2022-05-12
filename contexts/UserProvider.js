import React from 'react'

export const userContext = React.createContext()

const UserProvider = ({ children }) => {
  const [user, setUser] = React.useState({})

  const setUserData = (userData) => setUser(userData)

  const value = {
    user,
    setUserData,
  }

  return <userContext.Provider value={value}>{children}</userContext.Provider>
}

export default UserProvider
