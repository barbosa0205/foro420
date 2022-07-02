import React from 'react'

const Icon = ({ size = 'text-4xl', icon, color = 'text-gray-50', ...rest }) => {
  return <i className={`${icon} ${color} ${size}  pl-4`} {...rest}></i>
}

export default Icon
