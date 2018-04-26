import './index.css'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import BEMHelper from 'react-bem-helper'
const classes = new BEMHelper('menu')

export default class Pagination extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    className: PropTypes.string,
  }

  state = {
    expanded: false,
  }

  toggle = () =>
    this.setState({
      expanded: !this.state.expanded,
    })

  render () {
    const { children, className } = this.props
    const { expanded } = this.state

    return (
      <span {...classes('', { expanded }, className)}>
        <button type="button" {...classes('toggle')} onClick={this.toggle}>
          <svg width="4px" height="20px" viewBox="0 0 4 20">
            <circle cx="2" cy="2" r="2" />
            <circle cx="2" cy="10" r="2" />
            <circle cx="2" cy="18" r="2" />
          </svg>
        </button>

        {expanded && <nav {...classes('content')}>{children}</nav>}
        {expanded && (
          <button
            type="button"
            {...classes('backdrop')}
            onClick={this.toggle}
            onFocus={this.toggle}
            aria-label="Close"
          />
        )}
      </span>
    )
  }
}
