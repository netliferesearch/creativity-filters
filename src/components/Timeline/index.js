import './index.css'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Input from '../Input'
import Textarea from '../Textarea'
import { withState } from '../../storage'

import BEMHelper from 'react-bem-helper'
const classes = new BEMHelper('timeline')

class Timeline extends Component {
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

  constructor (props) {
    super(props)

    this.state = {
      autoFocus: false,
    }
  }

  handleItemChange = (id, key) => ({ target }) => {
    const { sectionId, updateContent } = this.props
    updateContent(sectionId, { id, [key]: target.value })
  }

  deleteItem = id => () => {
    const { sectionId, deleteContent } = this.props
    deleteContent(sectionId, id)
  }

  addNew = () => {
    const { sectionId, createContent } = this.props

    createContent(sectionId, { year: '', content: '' })

    this.setState({ autoFocus: true })
    setTimeout(() => {
      this.setState({ autoFocus: false })
    }, 100)
  }

  render () {
    const { autoFocus } = this.state
    const { content } = this.props

    const contentArray = Object.keys(content).map((key, index) => ({
      id: key,
      ...content[key],
    }))

    return (
      <div {...classes('')}>
        {contentArray && (
          <ol {...classes('list')}>
            {contentArray.map((item, index) => (
              <li key={index} {...classes('item')}>
                <Input
                  value={item.year}
                  onChange={this.handleItemChange(item.id, 'year')}
                  autoFocus={autoFocus}
                  {...classes('input')}
                />
                <Textarea
                  value={item.content}
                  onChange={this.handleItemChange(item.id, 'content')}
                  {...classes('textarea')}
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

export default withState(Timeline)
