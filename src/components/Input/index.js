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
  }

  state = {
    width: 0,
  }

  componentDidMount () {
    this.setWidth()

    setTimeout(this.setWidth, 50)
    setTimeout(this.setWidth, 100)
    setTimeout(this.setWidth, 300)

    window.addEventListener('resize', this.setWidth)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.setWidth)
  }

  componentDidUpdate (prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setWidth()
    }
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
