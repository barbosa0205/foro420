import React, { useCallback } from 'react'

const ListBox = ({ children, handleChange, selected }) => {
  const handleChangeCallback = useCallback(handleChange, [handleChange])
  return (
    <select
      value={selected?.value}
      onChange={() => handleChangeCallback}
      className='px-1 bg-transparent w-min h-fit cursor-pointer focus:outline-none'
    >
      {children}
    </select>
  )
}

export default React.memo(ListBox)
