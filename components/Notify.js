import React from 'react'
import Icon from './Icons/Icon'
import PushAlerts from './PushAlerts'

const Notify = ({ styles }) => {
  return (
    <>
      <div className={`${styles}`}>
        <Icon icon='ri-notification-2-line cursor-pointer'></Icon>
      </div>
      <PushAlerts />
    </>
  )
}

export default Notify
