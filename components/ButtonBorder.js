import React from 'react'

const ButtonBorder = ({
  text,
  color = 'bg-green-600',
  borderColor = 'border-green-600',
  colorText = 'text-green-600',
  otherStyles = '',
  ...rest
}) => {
  return (
    <button
      className={`px-5 py-1 ml-3 mr-5 rounded-md font-mono font-bold border-2 ${borderColor} ${colorText} shadow-md shadow-gray-200 ${otherStyles}`}
      {...rest}
    >
      {text}
    </button>
  )
}

export default ButtonBorder
