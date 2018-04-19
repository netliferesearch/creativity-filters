import './index.css'

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import Input from '../Input'

import BEMHelper from 'react-bem-helper'
const classes = new BEMHelper('sliders')

export default function Sliders ({ content, handleChange }) {
  const handleUpdate = (index, key) => ({ target }) => {
    const newContent = content.map((item, i) => {
      if (i === index) {
        return { ...item, [key]: target.value }
      }
      return { ...item }
    })

    handleChange('content', newContent)
  }

  const addNew = () => {
    const newItems = content.filter(item => !!item) // Not sure why I need to filter this
    newItems.push({ from: '', to: '', value: 50 })

    handleChange('content', newItems)
  }

  return (
    <div {...classes('')}>
      <div {...classes('list')}>
        {content.map((item, index) => (
          <Fragment key={index}>
            <span {...classes('value', 'from')}>
              <Input value={item.from} onChange={handleUpdate(index, 'from')} />
            </span>

            <label {...classes('slider-wrapper')}>
              <input
                type="range"
                min="0"
                max="100"
                value={item.value}
                onChange={handleUpdate(index, 'value')}
                {...classes('slider')}
              />
              <span {...classes('indicator')} />
              <span {...classes('indicator')} />
              <span {...classes('indicator')} />
            </label>

            <span {...classes('value', 'to')}>
              <Input value={item.to} onChange={handleUpdate(index, 'to')} />
            </span>
          </Fragment>
        ))}
      </div>

      <button type="button" {...classes('add-new')} onClick={addNew}>
        <span {...classes('add-new-icon')} /> Add moar
      </button>
    </div>
  )
}

Sliders.propTypes = {
  content: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
}
