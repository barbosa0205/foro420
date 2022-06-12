import React from 'react'

export const userContext = React.createContext()

const UserProvider = ({ children }) => {
  const [userSignInfo, setUserSignInfo] = React.useState({})
  const [userF420, setUserF420] = React.useState({})

  const setUserData = (userData) => setUserSignInfo(userData)

  const value = {
    user: userSignInfo,
    userF420,
    setUserF420,
    setUserData,
  }

  return <userContext.Provider value={value}>{children}</userContext.Provider>
}

export default UserProvider
