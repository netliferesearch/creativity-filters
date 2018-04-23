import './index.css'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withState } from '../../storage'
import SlotMachineData from './data'

import BEMHelper from 'react-bem-helper'
const classes = new BEMHelper('slot-machine')

class SlotMachine extends Component {
  static propTypes = {
    list1: PropTypes.object,
    list2: PropTypes.object,
    list3: PropTypes.object,
    createProject: PropTypes.func.isRequired,
  }

  playSlotMachine = event => {
    event.preventDefault()
  }

  makeProject () {
    this.props.createProject({
      title: 'random',
    })
  }

  render () {
    const data = SlotMachineData

    return (
      <div {...classes('')}>
        <h1 {...classes('title')}>🌈 🦄 Slot Machine 🦄 🌈</h1>

        <div {...classes('frame')}>
          <div {...classes('bar-window')}>
            <ul {...classes('bar')}>
              {data.list1.map((item, i) => (
                <li {...classes('bar-item')} key={i}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div {...classes('bar-window')}>
            <ul {...classes('bar')}>
              {data.list2.map((item, i) => (
                <li {...classes('bar-item')} key={i}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div {...classes('bar-window')}>
            <ul {...classes('bar')}>
              {data.list3.map((item, i) => (
                <li {...classes('bar-item')} key={i}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <form onSubmit={this.playSlotMachine}>
          <button type="submit" {...classes('action')}>
            Make magic
          </button>
        </form>
      </div>
    )
  }
}

export default withState(SlotMachine)
