import React from 'react'

export const MenuPopup = ({ children }) => {
  return (
    <div className='absolute top-2 right-1 w-fit px-3 bg-stone-100 shadow-md'>
      {children}
    </div>
  )
}
