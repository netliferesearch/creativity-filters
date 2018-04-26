import './index.css'

import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types'

import { withState } from '../../storage'
import Pagination from '../Pagination'

import BEMHelper from 'react-bem-helper'
const classes = new BEMHelper('toolbar')

class Toolbar extends PureComponent {
  static propTypes = {
    // ...
  }

  componentDidMount () {
    // ...
  }

  enterFullscreen (el) {
    const element = el || document.documentElement

    if (element.requestFullscreen) {
      element.requestFullscreen()
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen()
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen()
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen()
    }
  }

  exitFullscreen () {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  }

  isFullscreen () {
    return !!(
      document.FullscreenElement ||
      document.mozFullscreenElement ||
      document.webkitFullscreenElement
    )
  }

  toggleFullscreen = () => {
    if (this.isFullscreen()) {
      this.exitFullscreen()
    } else {
      this.enterFullscreen()
    }
  }

  render () {
    return (
      <nav {...classes('')}>
        <Pagination {...this.props} />

        <button
          type="button"
          {...classes('fullscreen')}
          onClick={this.toggleFullscreen}
        >
          <svg
            width="23px"
            height="23px"
            viewBox="0 0 23 23"
            {...classes('fullscreen-icon')}
          >
            <polyline
              {...classes('stroke')}
              points="1,11.5 1,1 22,1 22,22 11.5,22 "
            />
            <line
              {...classes('stroke')}
              x1="1.5"
              y1="21.5"
              x2="12.5"
              y2="10.5"
            />
            <polyline {...classes('stroke')} points="5,10 13,10 13,18 " />
          </svg>
        </button>
      </nav>
    )
  }
}

export default withState(Toolbar)
