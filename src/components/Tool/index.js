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
    const { focus } = this.state

    return (
      <article {...classes('', { focus })} ref={el => (this.wrapper = el)}>
        <div {...classes('content')}>
          <Section
            title="Problemstillinger"
            handleClick={this.toggleSectionFocus}
            name="problems"
            active={focus === 'problems'}
            ref={ref => (this.sections.problems = ref)}
          >
            <List
              items={[
                'Du er problem',
                'Nei, du er problem',
                'Hva er problemet deres?!',
              ]}
            />
          </Section>

          <Section
            title="Målgrupper"
            handleClick={this.toggleSectionFocus}
            name="targetgroup"
            active={focus === 'targetgroup'}
            ref={ref => (this.sections.targetgroup = ref)}
          >
            Her putter du målgrupper i prioritert rekkefølge
          </Section>

          <Section
            title="Målsetninger"
            handleClick={this.toggleSectionFocus}
            name="goals"
            active={focus === 'goals'}
            ref={ref => (this.sections.goals = ref)}
          >
            Her putter du målsetninger
          </Section>

          <Section
            title="Brukeroppgaver"
            handleClick={this.toggleSectionFocus}
            name="usertasks"
            active={focus === 'usertasks'}
            ref={ref => (this.sections.usertasks = ref)}
          >
            Her putter du brukeroppgaver
          </Section>

          <Section
            title="Oppfattelse"
            handleClick={this.toggleSectionFocus}
            name="attributes"
            active={focus === 'attributes'}
            ref={ref => (this.sections.attributes = ref)}
          >
            Her putter du hvordan du ønsker å oppfattes
          </Section>
        </div>
      </article>
    )
  }
}

export default withState(Tool)
