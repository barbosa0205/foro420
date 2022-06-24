import React from 'react'

export const Alert = ({ children, message, type, actionNo, actionYes }) => {
  return (
    <div className='flex flex-col justify-center items-center w-fit h-fit px-2 py-10 bg-emerald-600 shadow-md mx-auto rounded-md'>
      <h3 className='text-stone-50 text-2xl font-bold'>{message}</h3>
      {type === 'yesno' ? (
        <div>
          <button
            onClick={actionYes}
            className='bg-stone-50 px-10 py-1 mx-2 mt-5 rounded-md text-emerald-600 text-bold'
          >
            SI
          </button>
          <button
            onClick={actionNo}
            className='bg-stone-50 px-10 py-1 mx-2 mt-5 rounded-md text-emerald-600 text-bold'
          >
            NO
          </button>
        </div>
      ) : (
        <>{children}</>
      )}
    </div>
  )
}
