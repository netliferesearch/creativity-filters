import './index.css'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Input from '../Input'
import { withState } from '../../storage'

import BEMHelper from 'react-bem-helper'
const classes = new BEMHelper('list')

class List extends Component {
  static propTypes = {
    content: PropTypes.object,
    createContent: PropTypes.func.isRequired,
    updateContent: PropTypes.func.isRequired,
    deleteContent: PropTypes.func.isRequired,
    sectionId: PropTypes.string.isRequired,
  }

  static defaultProps = {
    content: {},
  }

  state = {
    autoFocus: false,
  }

  handleItemChange = id => ({ target }) => {
    const { sectionId, updateContent } = this.props
    updateContent(sectionId, { id, content: target.value })
  }

  deleteItem = id => () => {
    const { sectionId, deleteContent } = this.props
    deleteContent(sectionId, id)
  }

  addNew = () => {
    const { sectionId, createContent } = this.props

    createContent(sectionId, { content: '' })

    this.setState({ autoFocus: true })
    setTimeout(() => {
      this.setState({ autoFocus: false })
    }, 100)
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
            {Object.keys(content)
              .map(key => ({ id: key, ...content[key] }))
              .map((item, index) => (
                <li key={index} {...classes('item')}>
                  <Input
                    value={item.content}
                    onChange={this.handleItemChange(item.id)}
                    autoFocus={autoFocus}
                    onKeyPress={this.handleKeyPress}
                    {...classes('input')}
                  />

                  <button
                    type="button"
                    {...classes('delete')}
                    onClick={this.deleteItem(item.id)}
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

export default withState(List)
