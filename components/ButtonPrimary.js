import React from 'react'

const ButtonPrimary = ({
  otherStyle,
  text,
  bgColor = 'bg-gray-50',
  color = 'text-green-600',
  ...rest
}) => {
  return (
    <>
      <button
        className={`px-5 py-1 mx-3 rounded-md ${bgColor} font-mono font-bold ${color} ${otherStyle}`}
        {...rest}
      >
        {text}
      </button>
    </>
  )
}

export default ButtonPrimary
