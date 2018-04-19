import './styles/styles.css'

import React, { Component, createContext } from 'react'
import PropTypes from 'prop-types'

const { Consumer, Provider } = createContext()

const store = {
  sections: [
    {
      title: 'Problemstillinger',
      slug: 'problemstillinger',
      type: 'priority',
      content: [
        { content: 'Du er problem' },
        { content: 'Nei, du er problem' },
        { content: 'Hva er problemet deres?!' },
      ],
    },
    {
      title: 'Målgrupper',
      slug: 'maalgrupper',
      type: 'priority',
      content: [
        { content: 'Tommy' },
        { content: 'Jonny' },
        { content: 'Bobby' },
      ],
    },
    {
      title: 'Målsetninger',
      slug: 'maalsetninger',
      type: 'priority',
      content: [
        { content: 'Penger' },
        { content: 'Penger' },
        { content: 'Penger' },
      ],
    },
    {
      title: 'Brukeroppgaver',
      slug: 'brukeroppgaver',
      type: 'priority',
      content: [
        { content: 'Buuuuuu' },
        { content: 'Buuu' },
        { content: 'Buuuuuu' },
      ],
    },
    {
      title: 'Oppfattelse',
      slug: 'oppfattelse',
      type: 'sliders',
      content: [
        { from: 'Smart', to: 'Dust', value: 80 },
        { from: 'Bra', to: 'Dårlig', value: 20 },
        { from: 'Kake', to: 'Biff', value: 20 },
      ],
    },
    {
      title: 'Konkurenter',
      slug: 'konkurenter',
      type: 'plot',
      content: {
        x: ['Smart', 'Dum'],
        y: ['Teit', 'Dust'],
        items: [
          { content: 'Navn', x: 20, y: 40 },
          { content: 'Kake', x: 20, y: 40 },
        ],
      },
    },
  ],
}

export class Storage extends Component {
  static propTypes = {
    initialState: PropTypes.object,
    children: PropTypes.any,
  }

  state = {
    ...this.props.initialState,
    ...store,
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
