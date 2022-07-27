import React, { useCallback } from 'react'
import { useSelect } from '../../hooks/useSelect'

const ListBox = ({ handleChange, children, otherStyles }) => {
  return (
    <select
      onChange={handleChange}
      className={`px-1 bg-transparent w-min h-fit cursor-pointer focus:outline-none ${otherStyles}`}
    >
      {children}
    </select>
  )
}

export default React.memo(ListBox)
