import React from 'react'

const Icon = ({
  size = 'text-4xl',
  icon,
  bgColor,
  color = 'text-gray-50',
  ...rest
}) => {
  return <i className={`${icon} ${color} ${size}`} {...rest}></i>
}

export default Icon
