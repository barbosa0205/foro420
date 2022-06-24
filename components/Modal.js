import React from 'react'

const Modal = ({ children, position = 'absolute' }) => {
  return (
    <div
      className={`${position} flex items-center justify-center left-0 top-0 w-full h-full`}
    >
      {children}
    </div>
  )
}

export default Modal
