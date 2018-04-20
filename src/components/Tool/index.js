import './index.css'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withState } from '../../storage'

import Section from '../Section'
import List from '../List'
import Sliders from '../Sliders'
import NewSection from '../NewSection'

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

  addSection = () => {
    const newSection = {
      title: 'Title',
      type: null,
      content: null,
    }

    this.props.createSection(newSection)

    // setTimeout(() => {
    //   this.toggleSectionFocus(newSections.length - 1)()
    // }, 100)
  }

  render () {
    const { sections } = this.props.project
    const { focus } = this.state

    return (
      <article
        {...classes('', focus !== false && 'focus')}
        ref={el => (this.wrapper = el)}
      >
        {sections && (
          <div {...classes('content')}>
            {Object.keys(sections)
              .map(key => ({ id: key, ...sections[key] }))
              .map((item, index) => (
                <div ref={ref => (this.sections[index] = ref)} key={index}>
                  <Section
                    key={index}
                    section={item}
                    handleClick={this.toggleSectionFocus(index)}

                    active={true}
                  >
                    {item.type === 'priority' && (
                      <List sectionId={item.id} content={item.content} />
                    )}
                    {item.type === 'sliders' && (
                      <Sliders content={item.content} />
                    )}
                    {!item.type && <NewSection section={item} />}
                  </Section>
                </div>
              ))}

            <button
              type="button"
              {...classes('add-new')}
              onClick={this.addSection}
            >
              +
            </button>
          </div>
        )}
      </article>
    )
  }
}

export default withState(Tool)
