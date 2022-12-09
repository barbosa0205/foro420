import React from 'react'

const Container = ({ children, styles }) => {
  return (
    <section
      className={`container w-full min-h-screen px-2 bg-gray-100 ${styles}`}
    >
      {children}
    </section>
  )
}

export default React.memo(Container)
