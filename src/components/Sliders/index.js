import './index.css'

import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import Input from '../Input'
import { withState } from '../../storage'

import BEMHelper from 'react-bem-helper'
const classes = new BEMHelper('sliders')

class Sliders extends Component {
  static propTypes = {
    content: PropTypes.object,
    sectionId: PropTypes.string.isRequired,
    updateContent: PropTypes.func.isRequired,
    deleteContent: PropTypes.func.isRequired,
    createContent: PropTypes.func.isRequired,
  }

  static defaultProps = {
    content: {},
  }

  state = {
    autoFocus: false,
  }

  handleUpdate = (id, key) => ({ target }) => {
    const { sectionId, updateContent } = this.props
    updateContent(sectionId, { id, [key]: target.value })
  }

  addNew = () => {
    const { sectionId, createContent } = this.props
    createContent(sectionId, { from: '', to: '', value: 50 })

    this.setState({ autoFocus: true })
    setTimeout(() => {
      this.setState({ autoFocus: false })
    }, 100)
  }

  deleteItem = id => () => {
    const { sectionId, deleteContent } = this.props

    deleteContent(sectionId, id)
  }

  render () {
    const { content } = this.props
    const { autoFocus } = this.state

    return (
      <div {...classes('')}>
        {content && (
          <div {...classes('list')}>
            {Object.keys(content)
              .map(key => ({ id: key, ...content[key] }))
              .map((item, index) => (
                <Fragment key={index}>
                  <span {...classes('value', 'from')}>
                    <Input
                      value={item.from}
                      onChange={this.handleUpdate(item.id, 'from')}
                      autoFocus={autoFocus}
                    />
                  </span>

                  <label {...classes('slider-wrapper')}>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={item.value}
                      onChange={this.handleUpdate(item.id, 'value')}
                      {...classes('slider')}
                    />
                    <span {...classes('indicator')} />
                    <span {...classes('indicator')} />
                    <span {...classes('indicator')} />
                  </label>

                  <span {...classes('value', 'to')}>
                    <Input
                      value={item.to}
                      onChange={this.handleUpdate(item.id, 'to')}
                    />

                    <button
                      type="button"
                      {...classes('delete')}
                      onClick={this.deleteItem(item.id)}
                    />
                  </span>
                </Fragment>
              ))}
          </div>
        )}

        <button type="button" {...classes('add-new')} onClick={this.addNew} />
      </div>
    )
  }
}

export default withState(Sliders)
