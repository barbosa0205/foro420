import React from 'react'

const ListItem = ({ text, otherStyles, ...rest }) => {
  return (
    <option on className={`text-gray-800 ${otherStyles}`} {...rest}>
      {text}
    </option>
  )
}

export default ListItem
