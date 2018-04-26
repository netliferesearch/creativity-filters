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

  constructor (props) {
    super(props)

    this.state = {
      autoFocus: false,
      content: props.content,
    }
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

  abortDrag = false
  dragElementIndex = -1

  abortKeyPress = node => ['INPUT', 'TEXTAREA'].includes(node)

  handleMouseDown = event => {
    this.abortDrag = this.abortKeyPress(event.target.nodeName)
  }

  handleDragStart = index => event => {
    if (this.abortDrag) {
      event.preventDefault()
    } else {
      const newContent = { ...this.state.content }
      newContent.ghost = { isGhost: true, sortIndex: index };

      this.setState({
        content: newContent
      })
    }
  }

  handleDrag = event => {
    // const { content } = this.state
    // const sortIndex = 7;
    //
    // content['ghost'] = { isGhost: true, sortIndex: sortIndex };
    //
    // this.setState({
    //   content
    // })
  }

  handleDragEnd = event => {
    const { content } = this.state
    const { ghost, ...newContent } = content

    this.setState({
      content: newContent
    })

    this.dragElementIndex = -1
  }

  allowDrop = event => {
    event.preventDefault()
  }

  render () {
    const { content, autoFocus } = this.state
    const contentArrayLength = Object.keys(content).length

    const contentArray = Object.keys(content)
      .map((key, index) => ({ id: key, ...content[key], sortIndex: content[key].sortIndex || contentArrayLength }))
      .sort((a, b) => {
        return a.sortIndex - b.sortIndex
      })

    return (
      <div {...classes('')}>
        {contentArray && (
          <ol {...classes('list')}
            onDragOver={this.allowDrop}>
            {contentArray.map((item, index) => {
                if (item.isGhost) {
                  return <li key={index}
                             {...classes('ghost')} />
                } else {
                  return <li key={index} {...classes('item')}
                      draggable="true"
                      onDragEnd={this.handleDragEnd}
                      onDragStart={this.handleDragStart(index)}
                      onDrag={this.handleDrag}
                      onMouseDown={this.handleMouseDown}>
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
                }
              })}
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
