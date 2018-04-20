import './styles/styles.css'

import React, { Component, createContext } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import slugify from './helpers/slugify'

import * as firebase from 'firebase/app'
import 'firebase/database'

const { Consumer, Provider } = createContext()

firebase.initializeApp({
  apiKey: 'AIzaSyDDxR0BcYP0GRsT70RJLJ27hr_b4z5DEys',
  authDomain: 'creativity-filters.firebaseapp.com',
  databaseURL: 'https://creativity-filters.firebaseio.com',
  projectId: 'creativity-filters',
  storageBucket: 'creativity-filters.appspot.com',
  messagingSenderId: '740131108588',
})

const database = firebase.database()

const projectTemplate = {
  title: '',
  sections: [
    {
      title: 'Problemstillinger',
      type: 'priority',
      content: [{ content: 'Kake' }],
    },
  ],
}

const store = {
  slug: '',
  project: {
    title: '',
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
    location: PropTypes.object,
  }

  setGlobalState ({ ...props }) {
    this.setState({ ...props })

    if (props.sections) {
      database.ref(`sections/${this.state.slug}`).set(props.sections)
    }

    if (props.newProject) {
      this.createProject(props.newProject)
    }
  }

  state = {
    ...store,
    setGlobalState: this.setGlobalState.bind(this),
  }

  componentDidMount () {
    // This is where we fetch stuff
    this.loadProjectData()
  }

  componentDidUpdate (prevProps) {
    if (this.props.location !== prevProps.location) {
      this.removeListeners()
      this.loadProjectData()
    }
  }

  loadProjectData () {
    const slug = this.props.location.pathname.split('/')[1]

    this.setState({
      slug,
    })

    // Get project
    this.projectRef = database.ref(`projects/${slug}`)
    this.projectRef.on('value', snapshot => {
      this.setState({
        project: snapshot.val(),
      })
    })

    // database.ref(`sections/${slug}`).set(this.state.sections);

    // Get sections
    this.sectionsRef = database.ref(`sections/${slug}`)
    this.sectionsRef.on('value', snapshot => {
      this.setState({
        sections: snapshot.val(),
      })
    })
  }

  createProject (project) {
    const slug = slugify(project.title)
    const sections = projectTemplate.sections.slice();

    // Require slug
    if (!slug || !slug.trim()) { return }

    // Does project exist?
    database
      .ref(`projects/${slug}`)
      .once('value')
      .then(snapshot => {
        if (snapshot.val()) {
          window.location.href = `/${slug}`
        } else {
          // Create new
          database
            .ref(`projects/${slug}`)
            .set(project)
            .then(() => {

              let sectionsRef = database.ref(`projects/${slug}/sections`)

              let updates = {};
              let sectionRef, contentRef, sectionContent;

              for (let section of sections) {
                sectionContent = section.content;
                delete section.content;

                // Add template sections
                sectionRef = sectionsRef.push(section)
                // updates[`projects/${slug}/sections/${sectionRef.key}`] = section

                // Add template content
                for (let content of sectionContent) {
                  contentRef = database.ref(`projects/${slug}/sections/${sectionRef.key}/content`).push()
                  updates[`projects/${slug}/sections/${sectionRef.key}/content/${contentRef.key}`] = content
                }
              }

              database
                .ref()
                .update(updates)
                .then(() => {
                  window.location.href = `/${slug}`
                })



                // .push(sections[0])
                // .then(() => {
                //
                //   database
                //     .ref(`projects/${slug}/sections`)
                //     .push(sections[0])
                //     .then(() => {
                //       window.location.href = `/${slug}`
                //     })
                // })
            });

          // const updates = {}
          // updates[`projects/${slug}`] = project
          // updates[`sections/${slug}`] = {}
          // database
          //   .ref()
          //   .update(updates)
          //   .then(() => {
          //     window.location.href = `/${slug}`
          //   })
        }
      })

    // database.ref(`projects/${slug}`).set(project);
    // database.ref(`sections/${slug}`).set(sections);
  }

  removeListeners () {
    if (this.projectRef) {
      this.projectRef.off()
    }

    if (this.sectionsRef) {
      this.sectionsRef.off()
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
