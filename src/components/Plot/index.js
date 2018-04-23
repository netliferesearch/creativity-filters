import './index.css'

import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import Input from '../Input'
import { withState } from '../../storage'

import BEMHelper from 'react-bem-helper'
const classes = new BEMHelper('plot')

class Plot extends Component {
  static propTypes = {
    content: PropTypes.object,
    sectionId: PropTypes.string.isRequired,
    updateContent: PropTypes.func.isRequired,
    createContent: PropTypes.func.isRequired,
  }

  static defaultProps = {
    content: {},
  }

  handleUpdate = (id, key) => ({ target }) => {
    const { sectionId, updateContent } = this.props
    updateContent(sectionId, { id, [key]: target.value })
  }

  addNewPlot = () => {
    const { sectionId, createContent } = this.props

    createContent(sectionId, {
      x: ['From', 'To'],
      y: ['From', 'To'],
      items: [{ content: 'Example', x: 20, y: 40 }],
    })

    this.setState({ autoFocus: true })
    setTimeout(() => {
      this.setState({ autoFocus: false })
    }, 100)
  }

  updateAxis = (content, axis, index) => ({ target }) => {
    const { sectionId, updateContent } = this.props

    const newContent = { ...content }
    newContent[axis][index] = target.value

    updateContent(sectionId, { id: content.id, [axis]: newContent[axis] })
  }

  updateItem = (content, key, index) => ({ target }) => {
    const { sectionId, updateContent } = this.props

    const newContent = { ...content }
    newContent.items[index][key] = target.value

    updateContent(sectionId, { id: content.id, items: newContent.items })
  }

  addItem = content => ({ target }) => {
    const { sectionId, updateContent } = this.props

    const newContent = { ...content }
    newContent.items.push({ content: 'Name', x: 80, y: 80 })

    updateContent(sectionId, { id: content.id, items: newContent.items })
  }

  handleDragEnd = (content, index) => ({ clientX, clientY }) => {
    const { sectionId, updateContent } = this.props
    const xPos = clientX - this.plot.offsetLeft
    const yPos = clientY - this.plot.offsetTop
    const width = this.plot.offsetWidth
    const height = this.plot.offsetHeight

    const x = Math.min(100, Math.max(0, xPos * 100 / width))
    const y = Math.min(100, Math.max(0, yPos * 100 / height))

    const newContent = { ...content }
    newContent.items[index].x = x
    newContent.items[index].y = y

    updateContent(sectionId, { id: content.id, items: newContent.items })
  }

  componentDidMount () {
    const { content } = this.props

    if (!Object.keys(content).length) {
      this.addNewPlot()
    }
  }

  render () {
    const { content } = this.props

    /*
    {
      id: {
        x: ['Smart', 'Dum'],
        y: ['Teit', 'Dust'],
        items: [
          { content: 'Navn', x: 20, y: 40 },
          { content: 'Kake', x: 20, y: 40 },
        ],
      },
    }
    */

    return (
      <Fragment>
        {Object.keys(content)
          .map(key => ({ id: key, ...content[key] }))
          .map((content, index) => (
            <div
              {...classes('')}
              key={content.id}
              ref={ref => (this.plot = ref)}
            >
              <button
                type="button"
                {...classes('add-new')}
                onClick={this.addItem(content)}
              >
                +
              </button>

              <span {...classes('x')}>
                <span {...classes('value', 'x')}>
                  <Input
                    value={content.x[0]}
                    {...classes('input')}
                    onChange={this.updateAxis(content, 'x', 0)}
                  />
                </span>
                <span {...classes('x-axis')} />
                <span {...classes('value', 'x')}>
                  <Input
                    value={content.x[1]}
                    {...classes('input')}
                    onChange={this.updateAxis(content, 'x', 1)}
                  />
                </span>
              </span>

              <span {...classes('y')}>
                <span {...classes('value', 'y')}>
                  <Input
                    value={content.y[0]}
                    {...classes('input', 'y')}
                    onChange={this.updateAxis(content, 'y', 0)}
                  />
                </span>
                <span {...classes('y-axis')} />
                <span {...classes('value', 'y')}>
                  <Input
                    value={content.y[1]}
                    {...classes('input', 'y')}
                    onChange={this.updateAxis(content, 'y', 1)}
                  />
                </span>
              </span>

              <ul {...classes('items')}>
                {content.items.map((item, index) => (
                  <li
                    {...classes('item')}
                    key={index}
                    style={{
                      top: `${item.y}%`,
                      left: `${item.x}%`,
                    }}
                    onDragEnd={this.handleDragEnd(content, index)}
                    draggable
                  >
                    <span {...classes('drag-handle')} />
                    <Input
                      {...classes('input', 'small')}
                      value={item.content}
                      onChange={this.updateItem(content, 'content', index)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </Fragment>
    )
  }
}

export default withState(Plot)
