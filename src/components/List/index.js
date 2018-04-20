import './index.css'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Input from '../Input'

import BEMHelper from 'react-bem-helper'
const classes = new BEMHelper('list')

export default class List extends Component {
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

  handleItemChange = index => ({ target }) => {
    const { content, handleChange } = this.props
    const newItems = [...content]
    newItems[index].content = target.value

    handleChange('content', newItems)
  }

  deleteItem = index => () => {
    const { content, handleChange } = this.props
    const newItems = content.filter((item, i) => i !== index)

    handleChange('content', newItems)
  }

  addNew = () => {
    const { content, handleChange } = this.props
    const newItems = [...content]
    newItems.push({ content: '' })

    this.setState({ autoFocus: true })
    setTimeout(() => {
      this.setState({ autoFocus: false })
    }, 100)

    handleChange('content', newItems)
  }

  handleKeyPress = ({ charCode }) => {
    if (charCode === 13) {
      this.addNew()
    }
  }

  render () {
    const { autoFocus } = this.state
    const { content } = this.props

    return (
      <div {...classes('')}>
        {content && (
          <ol {...classes('list')}>
            {content.map((item, index) => (
              <li key={index} {...classes('item')}>
                <Input
                  value={item.content}
                  onChange={this.handleItemChange(index)}
                  autoFocus={autoFocus}
                  onKeyPress={this.handleKeyPress}
                  {...classes('input')}
                />

                <button
                  type="button"
                  {...classes('delete')}
                  onClick={this.deleteItem(index)}
                />
              </li>
            ))}
          </ol>
        )}

        <button type="button" {...classes('add-new')} onClick={this.addNew}>
          +
        </button>
      </div>
    )
  }
}
