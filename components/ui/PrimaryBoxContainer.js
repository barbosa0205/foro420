import React from 'react'

const PrimaryBoxContainer = ({ title, children }) => {
  return (
    <section className=' bg-white mt-10 py-3 rounded-md shadow-sm max-w-screen-md mx-auto'>
      <h2 className='font-semibold text-3xl text-center text-emerald-600 my-2'>
        {title}
      </h2>
      <div>{children}</div>
    </section>
  )
}

export default PrimaryBoxContainer
