import React, { useState, useEffect } from 'react'

export const useFetch = (url, config) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [canFetch, setCanFetch] = useState(false)

  const handleFetch = () => {
    setCanFetch(!canFetch)
  }

  const fetchData = async (url) => {
    try {
      setLoading(true)
      const resp = await fetch(url, {
        method: config.method,
        body: config.body,
      })
      const data = await resp.json()
      setData(data)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (canFetch && url) {
      fetchData(url)
    }
  }, [canFetch])

  return [data, loading, handleFetch]
}
