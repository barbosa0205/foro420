import React from 'react'

const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = React.useState({})

  function getWidthDimensions() {
    const { innerWidth: width, innerHeight: height } = window
    return { width, height }
  }

  React.useEffect(() => {
    if (!windowDimensions?.width) {
      handleResize()
    }
    window.addEventListener('resize', handleResize)
    function handleResize() {
      setWindowDimensions(getWidthDimensions())
    }
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowDimensions
}

export default useWindowDimensions
