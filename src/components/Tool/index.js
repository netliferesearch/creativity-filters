import './index.css'

import Section from '../Section'
import List from '../List'

import getPosition from '../../helpers/getPosition'
import scrollTo from '../../helpers/scrollTo'

import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import BEMHelper from 'react-bem-helper'
const classes = new BEMHelper('tool')

// This needs to match the scale in css
const SCALE = 0.8
// TODO: Ditch scale and use 80(ish)vw units for sections, since the zooming happens there anyway

export default class Tool extends Component {
  constructor () {
    super()

    this.state = {
      focus: false,
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
        this.setState({
          focus: name,
        }),
      duration / (speedy ? 5 : 3)
    )
  }

  handleSectionClick = ({ element, name }) => {
    if (this.state.focus !== name) {
      this.animateTo({ element, name, speedy: this.state.focus })
    } else {
      this.setState({
        focus: false,
      })
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
