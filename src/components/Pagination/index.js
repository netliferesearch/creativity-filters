import './index.css'

import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types'

import { withState } from '../../storage'
//
// import getPosition from '../../helpers/getPosition'
// import scrollTo from '../../helpers/scrollTo'

import BEMHelper from 'react-bem-helper'

const classes = new BEMHelper('pagination')

class Pagination extends PureComponent {
  static propTypes = {
    // ...
  }

  componentDidMount () {
    // ...
  }


  render () {
    return <nav {...classes('')}>
      <button {...classes('bullet', 'active')}></button>
      <button {...classes('bullet')}></button>
      <button {...classes('bullet')}></button>
      <button {...classes('bullet')}></button>
      <button {...classes('bullet')}></button>
    </nav>
  }
}

export default withState(Pagination)
