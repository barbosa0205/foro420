import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Icon from './Icons/Icon'
import formatDistance from 'date-fns/formatDistance'
import { es } from 'date-fns/locale'
import { MenuPopup } from './MenuPopup'
import axios from 'axios'
export const NotificationCard = ({ notify, ...rest }) => {
  const [openMenu, setOpenMenu] = useState(false)

  const setNotifyViewed = async () => {
    try {
      const data = await axios.put(
        `/api/notifications/notify?method=markAsRead`
      )
    } catch (error) {
      console.log('error al marcar como leída la notificacion')
    }
  }
  const deleteNotify = () => {}

  useEffect(() => {
    console.log('notify', notify)
    const date = new Date()
    const dateToCompare = new Date(notify.createdAt)
    console.log(formatDistance(date, dateToCompare))
  }, [])

  return (
    <>
      <li
        className='relative w-full shadow-gray-200 shadow-md py-5 px-5 my-1 list-none'
        {...rest}
      >
        <div className='w-full flex items-center justify-end'>
          <Icon
            icon={'ri-more-2-line cursor-pointer'}
            color='text-gray-800'
            onClick={() => setOpenMenu(!openMenu)}
          />
        </div>
        <header className='w-full flex items-center'>
          <Image
            src={notify.from.image}
            width={60}
            height={60}
            objectFit='cover'
            alt={'user'}
          />
          <p className='px-2 font-semibold text-3xl text-emerald-600 '>
            {notify.from.username}
          </p>
        </header>
        <main className='w-full flex items-center'>
          <div className='w-full flex items-center'>
            <div className='py-1 px-3 ml-2 rounded-lg bg-emerald-500'>
              <Icon icon={notify.icon} bgColor={'bg-emerald-600'} />
            </div>
            <p className='px-2 font-semibold text-2xl'>{notify.notification}</p>
          </div>
        </main>
        <footer className='w-full flex items-center justify-end'>
          <p className='pr-5 text-xl'>
            {formatDistance(new Date(), new Date(notify.createdAt), {
              locale: es,
            })}
          </p>
        </footer>
        {/* options Notification */}
        {/* TODO: Create logic  of setNotifyViewed and deleteNotify */}
        {openMenu && (
          <MenuPopup top='top-6' right={'right-14'}>
            <p
              className='cursor-pointer my-2'
              onClick={() => setNotifyViewed(notify._id)}
            >
              Marcar como leído
            </p>
            <p
              className='cursor-pointer my-2'
              onClick={() => deleteNotify(notify._id)}
            >
              Eliminar notificación
            </p>
          </MenuPopup>
        )}
      </li>
    </>
  )
}
