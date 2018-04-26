import './index.css'

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withState } from '../../storage'

import BEMHelper from 'react-bem-helper'
const classes = new BEMHelper('pagination')

class Pagination extends PureComponent {
  static propTypes = {
    project: PropTypes.object.isRequired,
    bulletClick: PropTypes.func.isRequired,
    active: PropTypes.number.isRequired,
  }

  componentDidMount () {
    // ...
  }

  render () {
    const { sections } = this.props.project

    if (sections) {
      return (
        <nav {...classes('')}>
          {Object.keys(sections)
            .map(key => ({ id: key, ...sections[key] }))
            .map((item, index) => (
              <button
                {...classes('bullet', this.props.active === index && 'active')}
                onClick={this.props.bulletClick(index)}
                key={index}
                aria-label={`Jump to "${item.title}"`}
              />
            ))}
        </nav>
      )
    }

    return null
  }
}

export default withState(Pagination)
