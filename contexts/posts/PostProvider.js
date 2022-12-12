import React, { useState } from 'react'

export const postContext = React.createContext()

const PostProvider = ({ children }) => {
  const [openCreatePost, setOpenCreatePost] = useState(false)
  const [loading, setLoading] = useState(false)
  const [feedPosts, setFeedPosts] = useState([])

  const value = {
    openCreatePost,
    setOpenCreatePost,
    loading,
    setLoading,
    feedPosts,
    setFeedPosts,
  }

  return <postContext.Provider value={value}>{children}</postContext.Provider>
}

export default PostProvider
