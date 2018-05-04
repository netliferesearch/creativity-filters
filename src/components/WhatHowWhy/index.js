import './index.css'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Input from '../Input'
import Textarea from '../Textarea'
import { withState } from '../../storage'

import BEMHelper from 'react-bem-helper'
const classes = new BEMHelper('what-how-why')

class WhatHowWhy extends Component {
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

  handleItemChange = (id, key) => ({ target }) => {
    const { sectionId, updateContent } = this.props
    updateContent(sectionId, { id, [key]: target.value })
  }

  makeNew = () => {
    const { sectionId, createContent } = this.props

    createContent(sectionId, { title: 'What', content: '' })
    createContent(sectionId, { title: 'How', content: '' })
    createContent(sectionId, { title: 'Why', content: '' })
  }

  componentDidMount () {
    const { content } = this.props

    if (!Object.keys(content).length) {
      this.makeNew()
    }
  }

  render () {
    const { content } = this.props
    const contentArrayLength = Object.keys(content).length

    const contentArray = Object.keys(content)
      .map((key, index) => ({
        id: key,
        ...content[key],
        sortIndex: content[key].sortIndex || contentArrayLength + index,
      }))
      .sort((a, b) => {
        return a.sortIndex - b.sortIndex
      })

    return (
      <div {...classes('')}>
        {contentArray && (
          <ul {...classes('list')}>
            {contentArray.map((item, index) => (
              <li key={index} {...classes('item')}>
                <Input
                  {...classes('title')}
                  value={item.title}
                  onChange={this.handleItemChange(item.id, 'title')}
                />
                <Textarea
                  value={item.content}
                  onChange={this.handleItemChange(item.id, 'content')}
                  {...classes('textarea')}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }
}

export default withState(WhatHowWhy)
