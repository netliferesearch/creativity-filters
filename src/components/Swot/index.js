import './index.css'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Input from '../Input'
import { withState } from '../../storage'

import BEMHelper from 'react-bem-helper'
const classes = new BEMHelper('swot')

function SwotItem ({
  item,
  autoFocus,
  handleItemChange,
  handleKeyPress,
  deleteItem,
}) {
  return (
    <li {...classes('item')} id={item.id}>
      <Input
        value={item.content}
        onChange={handleItemChange(item.id)}
        autoFocus={autoFocus === item.type}
        onKeyPress={handleKeyPress(item.type)}
        {...classes('input')}
      />

      <button
        type="button"
        {...classes('delete')}
        onClick={deleteItem(item.id)}
      />
    </li>
  )
}

SwotItem.propTypes = {
  item: PropTypes.object.isRequired,
  autoFocus: PropTypes.string,
  handleItemChange: PropTypes.func.isRequired,
  handleKeyPress: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
}

class Swot extends Component {
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
      autoFocus: null,
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

  addNew = type => () => {
    const { sectionId, createContent } = this.props

    createContent(sectionId, { content: '', type })

    this.setState({ autoFocus: type })
    setTimeout(() => {
      this.setState({ autoFocus: null })
    }, 100)
  }

  handleKeyPress = type => ({ charCode }) => {
    if (charCode === 13) {
      this.addNew(type)()
    }
  }

  render () {
    const { autoFocus } = this.state
    const { content } = this.props

    const contentArray = Object.keys(content).map((key, index) => ({
      id: key,
      ...content[key],
    }))

    if (contentArray) {
      return (
        <div {...classes('')} ref={ref => (this.wrapper = ref)}>
          <ul {...classes('section', 'strength')}>
            <h3 {...classes('title')}>Styrker</h3>
            {contentArray
              .filter(({ type }) => type === 'strength')
              .map(item => (
                <SwotItem
                  item={item}
                  key={item.id}
                  handleItemChange={this.handleItemChange}
                  handleKeyPress={this.handleKeyPress}
                  deleteItem={this.deleteItem}
                  autoFocus={autoFocus}
                />
              ))}
            <li>
              <button
                type="button"
                {...classes('add-new')}
                onClick={this.addNew('strength')}
              >
                +
              </button>
            </li>
          </ul>
          <ul {...classes('section', 'weaknesses')}>
            <h3 {...classes('title')}>Svakheter</h3>
            {contentArray
              .filter(({ type }) => type === 'weaknesses')
              .map(item => (
                <SwotItem
                  item={item}
                  key={item.id}
                  handleItemChange={this.handleItemChange}
                  handleKeyPress={this.handleKeyPress}
                  deleteItem={this.deleteItem}
                  autoFocus={autoFocus}
                />
              ))}
            <li>
              <button
                type="button"
                {...classes('add-new')}
                onClick={this.addNew('weaknesses')}
              >
                +
              </button>
            </li>
          </ul>
          <ul {...classes('section', 'opportunities')}>
            <h3 {...classes('title')}>Muligheter</h3>
            {contentArray
              .filter(({ type }) => type === 'opportunities')
              .map(item => (
                <SwotItem
                  item={item}
                  key={item.id}
                  handleItemChange={this.handleItemChange}
                  handleKeyPress={this.handleKeyPress}
                  deleteItem={this.deleteItem}
                  autoFocus={autoFocus}
                />
              ))}
            <li>
              <button
                type="button"
                {...classes('add-new')}
                onClick={this.addNew('opportunities')}
              >
                +
              </button>
            </li>
          </ul>
          <ul {...classes('section', 'threats')}>
            <h3 {...classes('title')}>Trusler</h3>
            {contentArray
              .filter(({ type }) => type === 'threats')
              .map(item => (
                <SwotItem
                  item={item}
                  key={item.id}
                  handleItemChange={this.handleItemChange}
                  handleKeyPress={this.handleKeyPress}
                  deleteItem={this.deleteItem}
                  autoFocus={autoFocus}
                />
              ))}
            <li>
              <button
                type="button"
                {...classes('add-new')}
                onClick={this.addNew('threats')}
              >
                +
              </button>
            </li>
          </ul>
        </div>
      )
    }
  }
}

export default withState(Swot)
