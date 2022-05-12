import React from 'react'

const Container = ({ children }) => {
  return (
    <section className='container w-full min-h-fit py-4'>{children}</section>
  )
}

export default React.memo(Container)
