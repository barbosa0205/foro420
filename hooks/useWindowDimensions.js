import React from 'react'

const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = React.useState({})

  function getWidthDimensions() {
    const { innerWidth: width, innerHeight: height } = window
    return { width, height }
  }

  React.useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWidthDimensions())
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  })
  return windowDimensions
}

export default useWindowDimensions
