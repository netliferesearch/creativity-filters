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
  dragging = false
  dragElement = null
  ghostElement = null

  abortKeyPress = node => ['INPUT', 'TEXTAREA'].includes(node)

  handleMouseDown = event => {
    this.abortDrag = this.abortKeyPress(event.target.nodeName)
  }

  handleDragStart = index => event => {
    if (this.abortDrag) {
      event.preventDefault()
    } else {
      this.dragElement = event.target.closest('.list__item')
      this.originalIndex = index
    }
  }

  handleDrag = event => {
    if (!this.dragging) {
      const element = this.dragElement
      element.classList.add('list__item--hidden')

      // Create ghost
      const ghost = document.createElement('li')
      ghost.classList.add('list__ghost')
      ghost.style.height = `${element.offsetHeight}px`
      ghost.style.display = 'none'
      this.ghostElement = ghost

      // Hide element
      element.style.opacity = '0'
      element.style.visibility = 'hidden'
      element.style.position = 'absolute'

      element.parentNode.insertBefore(ghost, element.nextSibling)

      this.dragging = true
    }

    const dragOverElement = document
      .elementFromPoint(event.clientX, event.clientY)
      .closest('.list__item')

    if (!dragOverElement) {
      return
    }

    // Hide Ghost when over initial element
    if (dragOverElement === this.dragElement) {
      this.ghostElement.style.display = 'none'
    } else {
      this.ghostElement.style.display = 'block'
    }

    // Move ghost
    const rect = dragOverElement.getBoundingClientRect()
    if (event.clientY - (rect.top + rect.height / 2) > 0) {
      dragOverElement.parentNode.insertBefore(
        this.ghostElement,
        dragOverElement.nextSibling
      )
    } else {
      dragOverElement.parentNode.insertBefore(
        this.ghostElement,
        dragOverElement
      )
    }
  }

  handleDragEnd = index => event => {
    const { content, sectionId, updateContent } = this.props
    const element = this.dragElement
    const ghost = this.wrapper.querySelector('.list__ghost')
    let dropIndex = -1

    if (element) {
      element.style.opacity = ''
      element.style.visibility = ''
      element.style.position = ''
    }

    if (ghost) {
      dropIndex = [...element.parentElement.children].indexOf(ghost)

      if (dropIndex > this.originalIndex) {
        dropIndex -= 1
      }

      ghost.remove()
    }

    const updatedList = [...this.list.children].map((item, index) => ({
      id: item.id,
      content: content[item.id].content,
    }))

    updatedList.splice(dropIndex, 0, ...updatedList.splice(index, 1))

    updatedList.forEach((item, index) => {
      updateContent(sectionId, {
        id: item.id,
        content: item.content,
        sortIndex: index + 1,
      })
    })

    this.dragging = false
    this.dragElement = null
    this.ghostElement = null
    this.originalIndex = -1
  }

  allowDrop = event => {
    event.preventDefault()
  }

  render () {
    const { autoFocus } = this.state
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
      <div {...classes('')} ref={ref => (this.wrapper = ref)}>
        {contentArray && (
          <ol
            {...classes('list')}
            onDragOver={this.allowDrop}
            ref={ref => (this.list = ref)}
          >
            {contentArray.map((item, index) => (
              <li
                key={index}
                {...classes('item')}
                draggable
                onDragStart={this.handleDragStart(index)}
                onDrag={this.handleDrag}
                onDragEnd={this.handleDragEnd(index)}
                onMouseDown={this.handleMouseDown}
                id={item.id}
              >
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
