import { useState } from 'react'

export const useMenu = () => {
  const [openMenu, setOpenMenu] = useState(false)

  const toggleMenu = () => {
    setOpenMenu(!openMenu)
  }

  return { openMenu, toggleMenu }
}
