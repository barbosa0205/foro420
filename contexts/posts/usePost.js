import React from 'react'
import { postContext } from './PostProvider'
const usePost = () => {
  const contextValue = React.useContext(postContext)
  return contextValue
}

export default usePost
