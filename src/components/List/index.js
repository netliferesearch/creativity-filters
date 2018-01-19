import './index.css'

import React from 'react'
import PropTypes from 'prop-types'

import BEMHelper from 'react-bem-helper'
const classes = new BEMHelper('list')

export default function Section ({ items }) {
  return (
    <ol {...classes('')}>
      {items.map((item, index) => (
        <li key={index} {...classes('item')}>
          {item}
        </li>
      ))}
    </ol>
  )
}

Section.propTypes = {
  items: PropTypes.array.isRequired,
}
