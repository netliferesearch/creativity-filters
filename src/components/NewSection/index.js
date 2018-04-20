import './index.css'

import React from 'react'
import PropTypes from 'prop-types'

import BEMHelper from 'react-bem-helper'
const classes = new BEMHelper('new-section')

export default function Section ({ handleChange }) {
  return (
    <nav {...classes('')}>
      <button
        type="button"
        {...classes('option')}
        onClick={() => handleChange('type', 'priority')}
      >
        Prioritized list
      </button>
      <button
        type="button"
        {...classes('option')}
        onClick={() => handleChange('type', 'sliders')}
      >
        Sliders
      </button>
      <button type="button" {...classes('option')}>
        Plot chart
      </button>
    </nav>
  )
}

Section.propTypes = {
  handleChange: PropTypes.func.isRequired,
}
