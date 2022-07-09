import React from 'react'

const Container = ({ children }) => {
  return (
    <section className='container w-full min-h-screen px-2 bg-white'>
      {children}
    </section>
  )
}

export default React.memo(Container)
