import React from 'react'

const ListItem = ({ text, ...rest }) => {
  return (
    <option className='bg-gray-50 text-gray-800' {...rest}>
      {text}
    </option>
  )
}

export default ListItem
