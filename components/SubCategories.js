import { useSelect } from 'hooks/useSelect'
import React, { useEffect, useState } from 'react'
import ListItem from './ListItem'
import ListBox from './ui/ListBox'

export const SubCategories = ({
  sub,
  subCategorySelected,
  setSubCategorySelected,
}) => {
  const [subCategories, setSubCategories] = useState(null)

  useEffect(() => {
    if (sub) {
      setSubCategories(sub)
    }
  }, [sub])
  useEffect(() => {
    if (subCategories) {
      setSubCategorySelected(subCategories[0])
    }
  }, [subCategories])

  return (
    <>
      {subCategories && (
        <>
          <p className='text-emerald-600 font-semibold'>subcategorias</p>
          <select
            className='cursor-pointer'
            value={subCategorySelected}
            onChange={(e) => {
              setSubCategorySelected(e.target.value)
            }}
          >
            {subCategories.map((sub, index) => {
              return (
                <option key={index} value={sub}>
                  {sub}
                </option>
              )
            })}
          </select>
        </>
      )}
    </>
  )
}
