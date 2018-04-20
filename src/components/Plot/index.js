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

  addNew = () => {
    const { sectionId, createContent } = this.props
    createContent(sectionId, {
      x: ['Smart', 'Dum'],
      y: ['Teit', 'Dust'],
      items: [
        { content: 'Navn', x: 20, y: 40 },
        { content: 'Kake', x: 20, y: 40 },
      ],
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

  handleDragEnd = ({ clientX, clientY }) => {
    console.log(
      clientX - this.plot.offsetLeft,
      clientY - this.plot.offsetTop,
      this.plot.offsetWidth,
      this.plot.offsetHeight
    )
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
                      top: `${100 - item.y}%`,
                      left: `${100 - item.x}%`,
                    }}
                    onDragEnd={this.handleDragEnd}
                    draggable
                  >
                    <span {...classes('drag-handle')} />
                    <Input
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
