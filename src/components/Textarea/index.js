import './index.css'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import BEMHelper from 'react-bem-helper'
const classes = new BEMHelper('textarea')

export default class Textarea extends Component {
  static propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string,
    autoFocus: PropTypes.bool,
    notRequired: PropTypes.bool,
  }

  state = {
    height: 0,
  }

  doneAutoFocus = false

  componentDidMount () {
    this.setHeight()

    setTimeout(this.setHeight, 50)
    setTimeout(this.setHeight, 100)
    setTimeout(this.setHeight, 300)

    window.addEventListener('resize', this.setHeight)

    if (this.props.autoFocus && !this.doneAutoFocus) {
      this.element.focus()

      this.doneAutoFocus = true
    }
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.setHeight)
  }

  componentDidUpdate (prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setHeight()
    }

    if (prevProps.autoFocus !== this.props.autoFocus && this.props.autoFocus) {
      this.element.select()
      this.doneAutoFocus = true
    }
  }

  handleChange = event => {
    this.setHeight()

    if (this.props.onChange) {
      this.props.onChange(event)
    }
  }

  setHeight = () => {
    this.setState({ height: 0 }, () => {
      this.setState({
        height: `${this.element.scrollHeight + 3}px`,
      })
    })
  }

  render () {
    const { className, autoFocus, notRequired, ...props } = this.props
    const { height } = this.state

    return (
      <textarea
        {...props}
        {...classes('', '', className)}
        ref={ref => (this.element = ref)}
        onChange={this.handleChange}
        style={{ height }}
        required={!notRequired}
      />
    )
  }
}
