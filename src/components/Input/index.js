import './index.css'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import BEMHelper from 'react-bem-helper'
const classes = new BEMHelper('section')

export default class Input extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
  }

  handleChange = event => {
    console.log(event, [event.target])
  }

  render () {
    return (
      <input
        {...classes('')}
        ref={ref => (this.element = ref)}
        onChange={this.handleChange}
        {...this.props}
      />
    )
  }
}
