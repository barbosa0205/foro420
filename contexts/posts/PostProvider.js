import React, { useState } from 'react'

export const postContext = React.createContext()

const PostProvider = ({ children }) => {
  const [openCreatePost, setOpenCreatePost] = useState(false)

  const value = {
    openCreatePost,
    setOpenCreatePost,
  }

  return <postContext.Provider value={value}>{children}</postContext.Provider>
}

export default PostProvider
