import React from 'react'

const IconButton = ({ icon, padding, ...rest }) => {
  return (
    <i
      {...rest}
      className={`${icon} text-4xl text-zinc-700 bg-zinc-100 ${padding} rounded-full cursor-pointer`}
    ></i>
  )
}

export default IconButton
