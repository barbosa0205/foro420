import React from 'react'

export const Input = ({ ...rest }) => {
  return (
    <input
      className='block py-1 px-2 bg-gray-100 shadow-sm ml-10 outline-none text-3xl my-5'
      {...rest}
    />
  )
}
