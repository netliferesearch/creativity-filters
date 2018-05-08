import './index.css'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Input from '../Input'
import { withState } from '../../storage'

import BEMHelper from 'react-bem-helper'
const classes = new BEMHelper('core-page')

function Section ({
  title,
  content,
  type,
  autoFocus,
  handleKeyPress,
  handleItemChange,
  addNew,
  deleteItem,
}) {
  return (
    <ul {...classes('section', type)}>
      <h3 {...classes('title')}>{title}</h3>

      {content.filter(item => item.type === type).map(item => (
        <li {...classes('item')} id={item.id} key={item.id}>
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
      ))}

      <li>
        <button type="button" {...classes('add-new')} onClick={addNew(type)}>
          +
        </button>
      </li>
    </ul>
  )
}

Section.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.array,
  type: PropTypes.string.isRequired,
  autoFocus: PropTypes.string,
  handleItemChange: PropTypes.func.isRequired,
  handleKeyPress: PropTypes.func.isRequired,
  addNew: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
}

class CorePage extends Component {
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
      const sharedProps = {
        content: contentArray,
        handleItemChange: this.handleItemChange,
        handleKeyPress: this.handleKeyPress,
        addNew: this.addNew,
        deleteItem: this.deleteItem,
        autoFocus,
      }

      return (
        <div {...classes('')}>
          <Section type="goals" title="Mål" {...sharedProps} />
          <Section type="usertasks" title="Brukeroppgaver" {...sharedProps} />
          <Section type="inwards" title="Veier inn" {...sharedProps} />
          <Section type="content" title="Kjerneinnhold" {...sharedProps} />
          <Section type="outwards" title="Veier videre" {...sharedProps} />
        </div>
      )
    }

    return null
  }
}

export default withState(CorePage)
