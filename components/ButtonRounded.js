import React from 'react'
{
  /*  */
}
const ButtonRounded = ({
  children,
  child = false,
  text,
  color = 'green-600',
  bgColor = 'gray-50',
  otherStyles = '',
  ...rest
}) => {
  return (
    <>
      {child ? (
        <button
          className={` py-1 my-1 rounded-full font-mono ${
            'text-' + color
          } font-bold ${'bg-' + bgColor} shadow-md shadow-gray-200 ${
            'border-2 border-' + color
          }`}
          {...rest}
        >
          {children}
        </button>
      ) : (
        <button
          className={`py-1 my-1 rounded-full font-mono ${
            'text-' + color
          } font-bold ${
            'bg-' + bgColor
          } shadow-md shadow-gray-200 ${otherStyles}`}
          {...rest}
        >
          {text}
        </button>
      )}
    </>
  )
}

export default ButtonRounded
