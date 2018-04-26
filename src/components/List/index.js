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
  originalIndex = -1

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

    const dragOverElement = document.elementFromPoint(
      event.clientX,
      event.clientY
    ).closest('.list__item')

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
    if (event.clientY - (rect.top + (rect.height / 2)) > 0) {
      dragOverElement.parentNode.insertBefore(this.ghostElement, dragOverElement.nextSibling)
    } else {
      dragOverElement.parentNode.insertBefore(this.ghostElement, dragOverElement)
    }
  }

  handleDragEnd = event => {
    const element = this.dragElement
    const ghost = this.wrapper.querySelector('.list__ghost')

    if (element) {
      element.style.opacity = '1'
      element.style.visibility = ''
      element.style.position = ''
    }

    if (ghost) {
      let dropIndex = [...element.parentElement.children].indexOf(ghost)
      if (dropIndex > this.originalIndex) {
        dropIndex -= 1
      }

      this.setItemOrder(dropIndex, this.originalIndex)

      ghost.remove()

    }

    this.dragging = false
    this.dragElement = null
    this.ghostElement = null
    this.originalIndex = -1
  }

  allowDrop = event => {
    event.preventDefault()
  }

  setItemOrder = (newIndex, oldIndex) => {
    const newContent = { ...this.props.content }
    const { sectionId, updateContent } = this.props

    const contentArrayLength = Object.keys(this.props.content).length
    let arr = Object.keys(this.props.content)
      .map((key, index) => ({
        id: key,
        ...this.props.content[key],
        sortIndex: index === oldIndex ? newIndex : this.props.content[key].sortIndex || contentArrayLength + index,
      }))
      .sort((a, b) => {
        return a.sortIndex - b.sortIndex
      })

      // Move!
      let item = arr[oldIndex]
      arr.splice(oldIndex, 1)

      if (newIndex < oldIndex) {
        arr.splice(newIndex-1, 0, item)
      } else {
        arr.splice(newIndex, 0, item)
      }

      arr.forEach((item, index) => {
        newContent[item.id].sortIndex = index;

        updateContent(sectionId, { id: item.id, sortIndex: index })
      })

      console.log(newContent)
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
      <div {...classes('')}
        ref={ref => this.wrapper = ref}>
        {contentArray && (
          <ol {...classes('list')} onDragOver={this.allowDrop}>
            {contentArray.map((item, index) => (
              <li
                key={index}
                {...classes('item')}
                draggable
                onDragStart={this.handleDragStart(index)}
                onDrag={this.handleDrag}
                onDragEnd={this.handleDragEnd}
                onMouseDown={this.handleMouseDown}
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
