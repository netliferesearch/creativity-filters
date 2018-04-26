import './index.css'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withState } from '../../storage'

import Section from '../Section'
import List from '../List'
import Sliders from '../Sliders'
import Plot from '../Plot'
import NewSection from '../NewSection'
import Toolbar from '../Toolbar'

import getPosition from '../../helpers/getPosition'
import scrollTo from '../../helpers/scrollTo'

import BEMHelper from 'react-bem-helper'

const classes = new BEMHelper('tool')

// This needs to match the scale in css
const SCALE = 0.8

class Tool extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    createSection: PropTypes.func.isRequired,
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
      activeIndex: 0,
    }

    this.sections = []
  }

  componentDidMount () {
    this.wrapper.addEventListener('scroll', this.handleScroll)
    window.addEventListener('wheel', this.handleMouseWheel)
    window.addEventListener('resize', this.handleResize)
    window.addEventListener('keyup', this.handleKeyUp)
  }

  componentDidUpdate () {
    // TODO: Remove!!!!
    // const { sections } = this.props.project
    //
    // if (
    //   sections &&
    //   Object.keys(sections).length >= 1 &&
    //   this.state.focus === false
    // ) {
    //   this.toggleSectionFocus(0)()
    // }
  }

  componentWillUnmount () {
    this.wrapper.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('wheel', this.handleMouseWheel)
    window.removeEventListener('resize', this.handleResize)
  }

  handleScroll = event => {
    const centerX = this.wrapper.offsetWidth / 2
    const centerY = this.wrapper.offsetHeight / 2

    const element = document
      .elementFromPoint(centerX, centerY)
      .closest('.tool__item')

    if (!element) {
      return
    }

    this.setState({
      activeIndex: Math.max(
        [...element.parentElement.children].indexOf(element),
        0
      ),
    })
  }

  handleMouseWheel = event => {
    if (event.deltaY && this.state.focus === false) {
      event.preventDefault()
      const scrollPos = this.wrapper.scrollLeft
      this.wrapper.scrollLeft = scrollPos + event.deltaY
    }
  }

  abortKeyPress = node => ['INPUT', 'TEXTAREA'].includes(node)

  handleKeyUp = event => {
    const { focus } = this.state

    if (event.keyCode === 37 && !this.abortKeyPress(event.target.nodeName)) {
      const prev = Math.max(focus - 1, 0)
      if (prev !== focus) {
        event.preventDefault()
        this.toggleSectionFocus(prev)()
      }
    } else if (
      event.keyCode === 39 &&
      !this.abortKeyPress(event.target.nodeName)
    ) {
      const prev = Math.min(focus + 1, this.sections.length - 1)
      if (prev !== focus) {
        event.preventDefault()
        this.toggleSectionFocus(prev)()
      }
    } else if (event.keyCode === 27 && focus !== false) {
      this.toggleSectionFocus(false)()
    }
  }

  handleResize = () => {
    const { focus, activeIndex } = this.state

    if (focus || focus === 0) {
      this.setState({ focus: false })
    }

    this.animateTo({ activeIndex })
  }

  animateTo = ({ index, speedy }) => {
    const element = this.sections[index]

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

  addSection = () => {
    const newSection = {
      title: 'Title',
      type: null,
      content: null,
    }

    this.props.createSection(newSection)

    setTimeout(() => {
      const { sections } = this.props.project
      this.toggleSectionFocus(Object.keys(sections).length - 1)()
    }, 100)
  }

  render () {
    const { sections } = this.props.project
    const { focus, activeIndex } = this.state

    return (
      <article
        {...classes('', focus !== false && 'focus')}
        ref={el => (this.wrapper = el)}
      >
        {sections && (
          <ul {...classes('content')}>
            {Object.keys(sections)
              .map(key => ({ id: key, ...sections[key] }))
              .map((item, index) => (
                <li
                  ref={ref => (this.sections[index] = ref)}
                  key={index}
                  {...classes('item')}
                >
                  <Section
                    section={item}
                    handleClick={this.toggleSectionFocus(index)}
                    active={index === focus}
                    focused={index === activeIndex}
                  >
                    {item.type === 'priority' && (
                      <List sectionId={item.id} content={item.content} />
                    )}
                    {item.type === 'sliders' && (
                      <Sliders sectionId={item.id} content={item.content} />
                    )}
                    {item.type === 'plot' && (
                      <Plot sectionId={item.id} content={item.content} />
                    )}
                    {!item.type && <NewSection section={item} />}
                  </Section>
                </li>
              ))}

            <button
              type="button"
              {...classes('add-new')}
              onClick={this.addSection}
            >
              +
            </button>
          </ul>
        )}
        <Toolbar active={activeIndex} bulletClick={this.toggleSectionFocus} />
      </article>
    )
  }
}

export default withState(Tool)
