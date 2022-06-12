import React, { useEffect } from 'react'

export const useSelect = ({
  options,
  optionSelected,
  setSubcategories,
  subcategories,
}) => {
  const [selected, setSelected] = React.useState(optionSelected)

  useEffect(() => {
    console.log('selected', selected)
  }, [options])

  useEffect(() => {
    if (selected?.subcategories) {
      const newsubcategories = selected.subcategories.map((sub) => ({
        name: sub,
      }))
      setSubcategories(newsubcategories)
    }
  }, [selected])

  useEffect(() => {
    if (subcategories?.length > 0) {
      setSelected(subcategories[0])
    }
    if (subcategories?.length === 0) {
      setSelected('')
    }
  }, [subcategories])

  const handleChange = (e) => {
    const { value } = e.target
    const newSelected = options.find((op) => op.name === value)
    console.log('newSelected', newSelected)
    setSelected(newSelected)
  }
  return [selected, handleChange]
}
