import './index.css'

import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types'

// import { withState } from '../../storage'
//
// import getPosition from '../../helpers/getPosition'
// import scrollTo from '../../helpers/scrollTo'

import BEMHelper from 'react-bem-helper'

const classes = new BEMHelper('toolbar')

export default class Toolbar extends PureComponent {
  static propTypes = {
    // ...
  }

  componentDidMount () {
    // ...
  }

  render () {
    return <nav {...classes('')}>Hej lasse grabban!</nav>
  }
}
