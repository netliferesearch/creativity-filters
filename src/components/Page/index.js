import './index.css'

import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import scrollTo from '../../helpers/scrollTo'

import BEMHelper from 'react-bem-helper'
const classes = new BEMHelper('page')

class Page extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    location: PropTypes.object.isRequired,
  }

  constructor () {
    super()

    this.state = {
      animating: true,
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.location !== prevProps.location) {
      this.handleRouteChange(this.props)
    }
  }

  handleRouteChange (props) {
    scrollTo({
      to: 0,
      duration: 200,
    })

    if (!this.state.animating) {
      this.setState({ animating: true })
    } else {
      clearTimeout(this.pageTransitionTimeout)
    }

    this.pageTransitionTimeout = setTimeout(
      () => this.setState({ animating: false }),
      1500
    )
  }

  render () {
    const { children } = this.props
    const { animating } = this.state

    return <main {...classes('', { animating })}>{children}</main>
  }
}

export default withRouter(Page)
