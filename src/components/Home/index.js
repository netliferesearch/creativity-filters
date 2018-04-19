import './index.css'

import React, { Component } from 'react'
// import PropTypes from 'prop-types'

import BEMHelper from 'react-bem-helper'
const classes = new BEMHelper('home')

export default class Home extends Component {
  static propTypes = {}

  makeProject = event => {
    event.preventDefault()

    // TODO: Make logic for creating something here

    window.location.href = `/${this.input.value}`
  }

  render () {
    return (
      <article {...classes('')}>
        <div {...classes('content')}>
          <h1 {...classes('title')}>Make a new project</h1>

          <form onSubmit={this.makeProject}>
            <label>
              Name it
              <input
                type="text"
                {...classes('input')}
                ref={ref => (this.input = ref)}
              />
            </label>
            <button type="submit" {...classes('action')}>
              Make
            </button>
          </form>
        </div>
      </article>
    )
  }
}
