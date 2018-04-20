import './index.css'

import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import Input from '../Input'

import BEMHelper from 'react-bem-helper'
const classes = new BEMHelper('sliders')

export default class Sliders extends Component {
  static propTypes = {
    content: PropTypes.array,
    handleChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    content: [],
  }

  state = {
    autoFocus: false,
  }

  handleUpdate = (index, key) => ({ target }) => {
    const { content, handleChange } = this.props

    const newContent = content.map((item, i) => {
      if (i === index) {
        return { ...item, [key]: target.value }
      }
      return { ...item }
    })

    handleChange('content', newContent)
  }

  addNew = () => {
    const { content, handleChange } = this.props

    const newItems = content.filter(item => !!item) // Not sure why I need to filter this
    newItems.push({ from: '', to: '', value: 50 })

    this.setState({ autoFocus: true })
    setTimeout(() => {
      this.setState({ autoFocus: false })
    }, 100)

    handleChange('content', newItems)
  }

  render () {
    const { content } = this.props
    const { autoFocus } = this.state

    return (
      <div {...classes('')}>
        {content && (
          <div {...classes('list')}>
            {content.map((item, index) => (
              <Fragment key={index}>
                <span {...classes('value', 'from')}>
                  <Input
                    value={item.from}
                    onChange={this.handleUpdate(index, 'from')}
                    autoFocus={autoFocus}
                  />
                </span>

                <label {...classes('slider-wrapper')}>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={item.value}
                    onChange={this.handleUpdate(index, 'value')}
                    {...classes('slider')}
                  />
                  <span {...classes('indicator')} />
                  <span {...classes('indicator')} />
                  <span {...classes('indicator')} />
                </label>

                <span {...classes('value', 'to')}>
                  <Input
                    value={item.to}
                    onChange={this.handleUpdate(index, 'to')}
                  />
                </span>
              </Fragment>
            ))}
          </div>
        )}

        <button type="button" {...classes('add-new')} onClick={this.addNew}>
          <span {...classes('add-new-icon')} /> Add slider
        </button>
      </div>
    )
  }
}