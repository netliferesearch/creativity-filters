import './index.css'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withState } from '../../storage'

import Section from '../Section'
import List from '../List'

import getPosition from '../../helpers/getPosition'
import scrollTo from '../../helpers/scrollTo'

import createHistory from 'history/createBrowserHistory'
import BEMHelper from 'react-bem-helper'

const classes = new BEMHelper('tool')
const history = createHistory()

// This needs to match the scale in css
const SCALE = 0.8

class Tool extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    sections: PropTypes.array.isRequired,
  }

  static defaultProps = {
    match: {
      params: {},
    },
  }

  constructor (props) {
    super(props)

    // const { page } = this.props.match.params

    this.state = {
      focus: false,
    }

    this.sections = {}
  }

  componentDidMount () {
    const { page } = this.props.match.params

    if (page) {
      setTimeout(() => this.toggleSectionFocus({ name: page }), 50)
    }

    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    const { focus } = this.state

    if (focus) {
      this.toggleSectionFocus({ name: false })
    }
  }

  animateTo = ({ name, speedy }) => {
    const { element } = this.sections[name]

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
      () =>
        this.setState(
          {
            focus: name,
          },
          this.makeURL
        ),
      duration / (speedy ? 5 : 3)
    )
  }

  makeURL = () => {
    const { focus } = this.state

    history.push({
      pathname: `/${focus || ''}`,
    })
  }

  toggleSectionFocus = ({ name }) => {
    if (name && this.state.focus !== name) {
      this.animateTo({ name, speedy: this.state.focus })
    } else {
      this.setState(
        {
          focus: false,
        },
        this.makeURL
      )
    }
  }

  render () {
    const { sections } = this.props
    const { focus } = this.state

    return (
      <article {...classes('', { focus })} ref={el => (this.wrapper = el)}>
        <div {...classes('content')}>
          {sections.map(item => (
            <Section
              key={item.slug}
              title={item.title}
              handleClick={this.toggleSectionFocus}
              name={item.slug}
              active={focus === item.slug}
              ref={ref => (this.sections[item.slug] = ref)}
            >
              {item.type === 'priority' && (
                <List items={item.content.map(({ content }) => content)} />
              )}
            </Section>
          ))}
        </div>
      </article>
    )
  }
}

export default withState(Tool)
