import './index.css'

import React from 'react'
import PropTypes from 'prop-types'

import BEMHelper from 'react-bem-helper'
const classes = new BEMHelper('section')

export default function Section ({
  children,
  title,
  handleClick,
  name,
  active,
}) {
  return (
    <section
      {...classes('', { active })}
      onClick={event => handleClick({ element: event.target, name })}
      role="button"
    >
      <h2 {...classes('title')}>{title}</h2>
      {children}
    </section>
  )
}

Section.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
  handleClick: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  active: PropTypes.bool,
}
