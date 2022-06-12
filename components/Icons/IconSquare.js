import React from 'react'

const IconSquare = ({
  children,
  width,
  height,
  icon,
  color,
  bgColor,
  ...rest
}) => {
  return (
    <i
      className={`${icon} ${color} ${bgColor} flex justify-center items-center w-16 h-16 rounded-md text-5xl m-2`}
      {...rest}
    >
      {children}
    </i>
  )
}

export default IconSquare
