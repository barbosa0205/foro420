import React from 'react'

const useSelect = (data) => {
  const handleChange = (e) => {
    const { value } = e.target
    const select = data.values.find((item) => item.value === value)
    setSelected({
      selected: select,
    })
  }
  const [selected, setSelected] = React.useState(data.selected)
  return [selected, handleChange]
}

export default useSelect
