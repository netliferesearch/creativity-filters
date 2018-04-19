import './styles/styles.css'

import React, { Component, createContext } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import createHistory from 'history/createBrowserHistory'

const history = createHistory()
const { Consumer, Provider } = createContext()

// import * as firebase from 'firebase/app';
// import 'firebase/database';

//
// firebase.initializeApp({
//   apiKey: "AIzaSyDDxR0BcYP0GRsT70RJLJ27hr_b4z5DEys",
//   authDomain: "creativity-filters.firebaseapp.com",
//   databaseURL: "https://creativity-filters.firebaseio.com",
//   projectId: "creativity-filters",
//   storageBucket: "creativity-filters.appspot.com",
//   messagingSenderId: "740131108588"
// });
//
// let database = firebase.database();
// let slug = new Date().getTime();
// database.ref(`projects/${slug}`).set({
//   'title': 'Moo'
// });

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

class Storage extends Component {
  static propTypes = {
    children: PropTypes.any,
  }

  state = {
    ...store,
    history,
    setGlobalState: this.setState.bind(this),
  }

  componentDidMount () {
    // This is where we fetch stuff
    // this.setState({
    //   sections: ['dsadasd'],
    // })
    // history.listen((location, action) => {
    //   console.log(this.props.match.params)
    // })
  }

  render () {
    const { children } = this.props

    return <Provider value={this.state}>{children}</Provider>
  }
}

export default withRouter(Storage)

// eslint-disable-next-line react/display-name
export const withState = WrappedComponent => props => (
  <Consumer>{state => <WrappedComponent {...state} {...props} />}</Consumer>
)
