import './styles/styles.css'

import React, { Component, createContext } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import * as firebase from 'firebase/app';
import 'firebase/database';

const { Consumer, Provider } = createContext()

firebase.initializeApp({
  apiKey: "AIzaSyDDxR0BcYP0GRsT70RJLJ27hr_b4z5DEys",
  authDomain: "creativity-filters.firebaseapp.com",
  databaseURL: "https://creativity-filters.firebaseio.com",
  projectId: "creativity-filters",
  storageBucket: "creativity-filters.appspot.com",
  messagingSenderId: "740131108588"
});

const database = firebase.database();
// let slug = new Date().getTime();
// database.ref(`projects/${slug}`).set({
//   'title': 'Moo'
// });

const store = {
  project: {
    title: ''
  },
  sections: [
    // {
    //   title: 'Problemstillinger',
    //   slug: 'problemstillinger',
    //   type: 'priority',
    //   content: [
    //     { content: 'Du er problem' },
    //     { content: 'Nei, du er problem' },
    //     { content: 'Hva er problemet deres?!' },
    //   ],
    // },
    // {
    //   title: 'Målgrupper',
    //   slug: 'maalgrupper',
    //   type: 'priority',
    //   content: [
    //     { content: 'Tommy' },
    //     { content: 'Jonny' },
    //     { content: 'Bobby' },
    //   ],
    // },
    // {
    //   title: 'Målsetninger',
    //   slug: 'maalsetninger',
    //   type: 'priority',
    //   content: [
    //     { content: 'Penger' },
    //     { content: 'Penger' },
    //     { content: 'Penger' },
    //   ],
    // },
    // {
    //   title: 'Brukeroppgaver',
    //   slug: 'brukeroppgaver',
    //   type: 'priority',
    //   content: [
    //     { content: 'Buuuuuu' },
    //     { content: 'Buuu' },
    //     { content: 'Buuuuuu' },
    //   ],
    // },
    // {
    //   title: 'Oppfattelse',
    //   slug: 'oppfattelse',
    //   type: 'sliders',
    //   content: [
    //     { from: 'Smart', to: 'Dust', value: 80 },
    //     { from: 'Bra', to: 'Dårlig', value: 20 },
    //     { from: 'Kake', to: 'Biff', value: 20 },
    //   ],
    // },
    // {
    //   title: 'Konkurenter',
    //   slug: 'konkurenter',
    //   type: 'plot',
    //   content: {
    //     x: ['Smart', 'Dum'],
    //     y: ['Teit', 'Dust'],
    //     items: [
    //       { content: 'Navn', x: 20, y: 40 },
    //       { content: 'Kake', x: 20, y: 40 },
    //     ],
    //   },
    // },
  ],
}

class Storage extends Component {
  static propTypes = {
    children: PropTypes.any,
  }

  state = {
    ...store,
    setGlobalState: this.setState.bind(this),
  }

  componentDidMount () {
    // This is where we fetch stuff
    // this.setState({
    //   sections: ['dsadasd'],
    // })
    this.loadProjectData();
  }

  componentDidUpdate (prevProps) {
    if (this.props.location !== prevProps.location) {
      this.removeListeners();
      this.loadProjectData();
    }
  }

  loadProjectData () {
    let slug = this.props.location.pathname.split('/')[1];

    // Get project
    this.projectRef = database.ref(`projects/${slug}`);
    this.projectRef.on('value', (snapshot) => {
      this.setState({
        project: snapshot.val(),
      })
    });

    // database.ref(`sections/${slug}`).set(this.state.sections);

    // Get sections
    this.sectionsRef = database.ref(`sections/${slug}`);
    this.sectionsRef.on('value', (snapshot) => {
      this.setState({
        sections: snapshot.val(),
      })
    });
  }

  removeListeners () {
    if (this.projectRef) {
      this.projectRef.off();
    }

    if (this.sectionsRef) {
      this.sectionsRef.off();
    }
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
