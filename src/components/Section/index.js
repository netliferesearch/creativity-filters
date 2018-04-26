import './index.css'

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import Input from '../Input'
import { withState } from '../../storage'

import BEMHelper from 'react-bem-helper'
const classes = new BEMHelper('section')

class Section extends PureComponent {
  static propTypes = {
    section: PropTypes.object.isRequired,
    children: PropTypes.any.isRequired,
    handleClick: PropTypes.func.isRequired,
    updateSection: PropTypes.func.isRequired,
    active: PropTypes.bool,
  }

  handleSectionKeyPress = ({ charCode }) => {
    if (charCode === 32 || charCode === 13) {
      const { handleClick } = this.props

      handleClick()
    }
  }

  render () {
    const { children, section, handleClick, active, focused, updateSection } = this.props

    const sectionProps = active
      ? {}
      : {
        onClick: handleClick,
        onKeyPress: this.handleSectionKeyPress,
        role: 'button',
        tabIndex: 0,
      }

    const buttonProps = active ? { onClick: handleClick } : { tabIndex: -1 }

    return (
      <section {...classes('', { active, focused })} {...sectionProps} id={section.id}>
        <button {...classes('close')} type="button" {...buttonProps}>
          <span {...classes('close-icon')} />
        </button>

        <h2 {...classes('title')}>
          <Input
            value={section.title}
            onChange={({ target }) =>
              updateSection({
                ...section,
                title: target.value,
              })
            }
            autoFocus={!section.type && active}
          />
        </h2>
        {children}
      </section>
    )
  }
}

export default withState(Section)
