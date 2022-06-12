import React, { useCallback } from 'react'
import { useSelect } from '../../hooks/useSelect'

const ListBox = ({ handleChange, children, otherStyles, value }) => {
  return (
    <select
      onChange={handleChange}
      className={`px-1 bg-transparent w-min h-fit cursor-pointer focus:outline-none ${otherStyles}`}
      value={value}
    >
      {children}
    </select>
  )
}

export default React.memo(ListBox)
