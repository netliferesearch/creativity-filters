import './index.css'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import SlotMachine from '../SlotMachine'
import { withState } from '../../storage'

import BEMHelper from 'react-bem-helper'
const classes = new BEMHelper('home')

class Home extends Component {
  static propTypes = {
    createProject: PropTypes.func.isRequired,
  }

  makeProject = event => {
    event.preventDefault()

    this.props.createProject({
      title: this.input.value,
    })
  }

  render () {
    return (
      <article {...classes('')}>
        <div {...classes('content')}>
          <h1 {...classes('title')}>Create a project</h1>

          <form onSubmit={this.makeProject} {...classes('form')}>
            <label {...classes('label')}>
              <input
                {...classes('input')}
                type="text"
                required
                ref={ref => (this.input = ref)}
              />
            </label>
            <button type="submit" {...classes('action')}>
              Create
            </button>
          </form>
          <p {...classes('description')}>
            The link you create can be shared and edited by anyone
          </p>
        </div>

        {/* <SlotMachine /> */}
      </article>
    )
  }
}

export default withState(Home)
