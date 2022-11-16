import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Icon from './Icons/Icon'
import formatDistance from 'date-fns/formatDistance'
import { es } from 'date-fns/locale'
import { MenuPopup } from './MenuPopup'
import { useRouter } from 'next/router'
import useUser from 'contexts/useUser'

export const NotificationCard = ({
  notify,
  allNotifications,
  setAllNotifications,
  ...rest
}) => {
  const router = useRouter()
  const [openMenu, setOpenMenu] = useState(false)
  const { setShowNotificationsSide } = useUser()
  const setNotifyViewed = async () => {
    try {
      const resp = await fetch(
        `/api/notifications/notify?method=markAsRead&id=${notify._id}`,
        {
          method: 'PUT',
        }
      )
      const data = await resp.json()
      if (data.success) {
        let notifyFind = allNotifications.find((n) => n._id === notify._id)
        notifyFind.pendientToView = false
        const notifyIndex = allNotifications.indexOf(notifyFind)
        const allNotificationsCopy = [...allNotifications]
        const arraySliced = allNotificationsCopy.slice(0, notifyIndex)
        console.log('arraySliced', arraySliced)
        const nextOfArray = [...allNotifications].slice(notifyIndex + 1)
        console.log('nextOfArray', nextOfArray)
        setAllNotifications([...arraySliced, notifyFind, ...nextOfArray])
      }
    } catch (error) {
      console.log('error al marcar como leída la notificacion', error)
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
        onClick={() => {
          router.push(`/posts/${notify.post}
          `)
          setShowNotificationsSide(false)
        }}
        className={`relative w-full shadow-gray-200 shadow-md py-2 px-2 my-1 list-none cursor-pointer ${
          notify.pendientToView && 'bg-cyan-700 bg-opacity-20'
        }`}
        {...rest}
      >
        <div className='w-full flex items-center justify-end'>
          <Icon
            icon={'ri-more-2-line cursor-pointer'}
            color='text-gray-800'
            onClick={(event) => {
              event.stopPropagation()
              setOpenMenu(!openMenu)
            }}
          />
        </div>
        <header className='w-full flex items-center mb-2'>
          <Image
            className='rounded-full'
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
          <div className=' mt-2 w-full flex items-center'>
            <div className='py-1 px-2 ml-2 rounded-lg bg-emerald-500'>
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
          <MenuPopup
            onClick={(event) => {
              event.stopPropagation()
            }}
            top='top-6'
            right={'right-14'}
          >
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
