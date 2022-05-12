import React from 'react'

const useWindowDimensions = () => {
  function getWidthDimensions() {
    const { innerWidth: width, innerHeight: height } = window
    return { width, height }
  }
  const [windowDimensions, setWindowDimensions] = React.useState({})

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
