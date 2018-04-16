import './styles/styles.css'

import React, { Component, createContext } from 'react'
import PropTypes from 'prop-types'

const { Consumer, Provider } = createContext()

export class Storage extends Component {
  static propTypes = {
    initialState: PropTypes.object,
    children: PropTypes.any,
  }

  state = {
    ...this.props.initialState,
    setGlobalState: this.setState.bind(this),
  }

  componentDidMount () {
    // This is where we fetch stuff
  }

  render () {
    const { children } = this.props

    return <Provider value={this.state}>{children}</Provider>
  }
}

// eslint-disable-next-line react/display-name
export const withState = WrappedComponent => props => (
  <Consumer>{state => <WrappedComponent {...state} {...props} />}</Consumer>
)
