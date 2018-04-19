import './index.css'

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import Input from '../Input'

import BEMHelper from 'react-bem-helper'
const classes = new BEMHelper('section')

export default class Section extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.any.isRequired,
    handleClick: PropTypes.func.isRequired,
    active: PropTypes.bool,
  }

  handleSectionKeyPress = ({ charCode }) => {
    if (charCode === 32 || charCode === 13) {
      const { handleClick } = this.props

      handleClick()
    }
  }

  render () {
    const { children, title, handleClick, active } = this.props

    const sectionProps = active
      ? {}
      : {
        onClick: handleClick,
        onKeyPress: this.handleSectionKeyPress,
        role: 'button',
        tabIndex: 0,
      }

    const buttonProps = active
      ? {
        onClick: handleClick,
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

        <Input {...classes('title')} defaultValue={title} />
        {children}
      </section>
    )
  }
}
