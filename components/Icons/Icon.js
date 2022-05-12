import React from 'react'

const Icon = ({ icon, color = 'text-gray-50', ...rest }) => {
  return (
    <i className={`${icon} ${color} text-4xl sm:text-5xl pl-4`} {...rest}></i>
  )
}

export default Icon
