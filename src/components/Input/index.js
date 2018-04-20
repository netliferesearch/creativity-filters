import './index.css'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import BEMHelper from 'react-bem-helper'
const classes = new BEMHelper('input')

export default class Input extends Component {
  static propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string,
    autoFocus: PropTypes.bool,
    notRequired: PropTypes.bool,
  }

  state = {
    width: 0,
  }

  doneAutoFocus = false

  componentDidMount () {
    this.setWidth()

    setTimeout(this.setWidth, 50)
    setTimeout(this.setWidth, 100)
    setTimeout(this.setWidth, 300)

    window.addEventListener('resize', this.setWidth)

    if (this.props.autoFocus && !this.doneAutoFocus) {
      this.element.focus()

      this.doneAutoFocus = true
    }
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.setWidth)
  }

  componentDidUpdate (prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setWidth()
    }

    if (prevProps.autoFocus !== this.props.autoFocus && this.props.autoFocus) {
      this.element.select()
      this.doneAutoFocus = true
    }
  }

  handleChange = event => {
    this.setWidth()

    this.props.onChange(event)
  }

  setWidth = () => {
    this.setState({ width: 0 }, () => {
      this.setState({
        width: `${this.element.scrollWidth + 1}px`,
      })
    })
  }

  render () {
    const { className, autoFocus, notRequired, ...props } = this.props
    const { width } = this.state

    return (
      <input
        {...props}
        {...classes('', '', className)}
        ref={ref => (this.element = ref)}
        onChange={this.handleChange}
        style={{ width }}
        required={!notRequired}
      />
    )
  }
}
