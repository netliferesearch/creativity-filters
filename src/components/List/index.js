import './index.css'

import React from 'react'
import PropTypes from 'prop-types'

import Input from '../Input'

import BEMHelper from 'react-bem-helper'
const classes = new BEMHelper('list')

export default function Section ({ content, handleChange }) {
  const handleItemChange = index => ({ target }) => {
    const newItems = [...content]
    newItems[index].content = target.value

    handleChange('content', newItems)
  }

  const addNew = () => {
    const newItems = [...content]
    newItems.push({ content: '' })

    handleChange('content', newItems)
  }

  return (
    <div {...classes('')}>
      <ol {...classes('list')}>
        {content.map((item, index) => (
          <li key={index} {...classes('item')}>
            <Input value={item.content} onChange={handleItemChange(index)} />
          </li>
        ))}
      </ol>

      <button type="button" {...classes('add-new')} onClick={addNew}>
        +
      </button>
    </div>
  )
}

Section.propTypes = {
  content: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
}
