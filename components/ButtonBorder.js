import React from 'react'

const ButtonBorder = ({
  text,
  borderColor = 'border-green-600',
  colorText = 'text-green-600',
  icon = '',
  otherStyles = '',
  ...rest
}) => {
  return (
    <>
      <button
        className={`flex items-center justify-center px-5 py-1 ml-3 mr-5 rounded-md font-mono font-bold border-2 ${borderColor} ${colorText} shadow-md shadow-gray-200 ${otherStyles}`}
        {...rest}
      >
        {text}
        {icon && <i className={`${icon} ml-2 text-3xl`}></i>}
      </button>
    </>
  )
}

export default ButtonBorder
