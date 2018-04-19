import './index.css'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import BEMHelper from 'react-bem-helper'
const classes = new BEMHelper('input')

export default class Input extends Component {
  static propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func,
  }

  state = {
    width: 0,
  }

  componentDidMount () {
    this.setWidth()

    setTimeout(this.setWidth, 50)
    setTimeout(this.setWidth, 100)
    setTimeout(this.setWidth, 300)
  }

  handleChange = event => {
    this.setWidth()

    this.props.onChange(event)
  }

  setWidth = () => {
    this.setState(
      {
        width: 0,
      },
      () => {
        this.setState({
          width: `${this.element.scrollWidth + 1}px`,
        })
      }
    )
  }

  render () {
    const { className } = this.props
    const { width } = this.state
    const styles = { width }

    return (
      <input
        {...this.props}
        {...classes('', '', className)}
        ref={ref => (this.element = ref)}
        onChange={this.handleChange}
        style={styles}
      />
    )
  }
}
