import './index.css'

import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types'

import { withState } from '../../storage'
import Pagination from '../Pagination'
//
// import getPosition from '../../helpers/getPosition'
// import scrollTo from '../../helpers/scrollTo'

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
    const element = el || document.documentElement;

    if(element.requestFullscreen) {
      element.requestFullscreen()
    } else if(element.mozRequestFullScreen) {
      element.mozRequestFullScreen()
    } else if(element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen()
    } else if(element.msRequestFullscreen) {
      element.msRequestFullscreen()
    }
  };

  exitFullscreen () {
    if(document.exitFullscreen) {
      document.exitFullscreen()
    } else if(document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if(document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  };

  isFullscreen () {
    return !!(document.FullscreenElement ||
           document.mozFullscreenElement ||
           document.webkitFullscreenElement);
  }

  toggleFullscreen = () => {
    if(this.isFullscreen()) {
      this.exitFullscreen()
    } else {
      this.enterFullscreen()
    }
  }

  render () {
    return <nav {...classes('')}>
      <button
        type="button"
        {...classes('fullscreen')}
        onClick={this.toggleFullscreen}
      >
      Fullscreen

      <Pagination></Pagination>
      </button>
    </nav>
  }
}

export default withState(Toolbar)
