import React from 'react'
import Icon from './Icons/Icon'

const Notify = ({ styles }) => {
  return (
    <div className={`${styles}`}>
      <Icon icon='ri-notification-2-line cursor-pointer'></Icon>
    </div>
  )
}

export default Notify
