import './index.css'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withState } from '../../storage'

import Section from '../Section'
import List from '../List'

import getPosition from '../../helpers/getPosition'
import scrollTo from '../../helpers/scrollTo'

import BEMHelper from 'react-bem-helper'

const classes = new BEMHelper('tool')

// This needs to match the scale in css
const SCALE = 0.8

class Tool extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    sections: PropTypes.array.isRequired,
    setGlobalState: PropTypes.func.isRequired,
  }

  static defaultProps = {
    match: {
      params: {},
    },
  }

  constructor (props) {
    super(props)

    this.state = {
      focus: false,
    }

    this.sections = []
  }

  componentDidMount () {
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    const { focus } = this.state

    if (focus || focus === 0) {
      this.setState({ focus: false })
    }
  }

  animateTo = ({ index, speedy }) => {
    const { element } = this.sections[index]

    if (!element) {
      return
    }

    const duration = 300
    const to = getPosition(element).x * SCALE

    scrollTo({
      element: this.wrapper,
      left: true,
      to,
      duration,
    })

    setTimeout(
      () => this.setState({ focus: index }),
      duration / (speedy ? 5 : 3)
    )
  }

  toggleSectionFocus = index => () => {
    if (index !== false && this.state.focus !== index) {
      this.animateTo({ index, speedy: !!this.state.focus })
    } else {
      this.setState({ focus: false })
    }
  }

  handleChange = index => (key, value) => {
    if (key && value) {
      const { sections } = this.props
      sections[index][key] = value

      this.props.setGlobalState({
        sections,
      })
    }
  }

  render () {
    const { sections } = this.props
    const { focus } = this.state

    return (
      <article
        {...classes('', focus !== false && 'focus')}
        ref={el => (this.wrapper = el)}
      >
        <div {...classes('content')}>
          {sections.map((item, index) => (
            <Section
              key={index}
              title={item.title}
              handleClick={this.toggleSectionFocus(index)}
              active={focus === index}
              ref={ref => (this.sections[index] = ref)}
              handleChange={this.handleChange(index)}
            >
              {item.type === 'priority' && (
                <List
                  content={item.content}
                  handleChange={this.handleChange(index)}
                />
              )}
            </Section>
          ))}
        </div>
      </article>
    )
  }
}

export default withState(Tool)
