import './index.css'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

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
// TODO: Ditch scale and use 80(ish)vw units for sections, since the zooming happens there anyway

export default class Tool extends Component {
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

    const { page } = this.props.match.params

    this.state = {
      focus: page || false,
    }
  }

  componentDidMount () {
    const { page } = this.props.match.params
    if (page) {
      // TODO: Use ref for active element
      const element = this.wrapper.querySelector('.section--active')
      const { focus } = this.state
      this.animateTo({ element, name: focus })
    }
  }

  animateTo = ({ element, name, speedy }) => {
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

  handleSectionClick = ({ element, name }) => {
    if (this.state.focus !== name) {
      this.animateTo({ element, name, speedy: this.state.focus })
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
            handleClick={this.handleSectionClick}
            name="problems"
            active={focus === 'problems'}
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
            title="Målsetninger"
            handleClick={this.handleSectionClick}
            name="goals"
            active={focus === 'goals'}
          >
            Her putter du målsetninger
          </Section>
          <Section
            title="Brukeroppgaver"
            handleClick={this.handleSectionClick}
            name="usertasks"
            active={focus === 'usertasks'}
          >
            Her putter du brukeroppgaver
          </Section>
          <Section
            title="Oppfattelse"
            handleClick={this.handleSectionClick}
            name="attributes"
            active={focus === 'attributes'}
          >
            Her putter du hvordan du ønsker å oppfattes
          </Section>
        </div>
      </article>
    )
  }
}
