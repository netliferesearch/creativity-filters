import './index.css'

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import BEMHelper from 'react-bem-helper'
const classes = new BEMHelper('section')

export default class Section extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.any.isRequired,
    handleClick: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    active: PropTypes.bool,
  }

  handleSectionKeyPress = ({ charCode }) => {
    if (charCode === 32 || charCode === 13) {
      const { handleClick, name } = this.props

      handleClick({ name })
    }
  }

  render () {
    const { children, title, handleClick, name, active } = this.props

    const sectionProps = active
      ? {}
      : {
        onClick: () => handleClick({ name }),
        onKeyPress: this.handleSectionKeyPress,
        role: 'button',
        tabIndex: 0,
      }

    const buttonProps = active
      ? {
        onClick: () => handleClick({ name }),
      }
      : {
        tabIndex: -1,
      }

    return (
      <section
        {...classes('', { active })}
        {...sectionProps}
        ref={ref => (this.element = ref)}
      >
        <button {...classes('close')} type="button" {...buttonProps}>
          <span {...classes('close-icon')} />
        </button>

        <h2 {...classes('title')}>{title}</h2>
        {children}
      </section>
    )
  }
}
