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

  state = {
    ...store,
    createSection: this.createSection.bind(this),
    updateSection: this.updateSection.bind(this),
    deleteSection: this.deleteSection.bind(this),
    createContent: this.createContent.bind(this),
    updateContent: this.updateContent.bind(this),
    deleteContent: this.deleteContent.bind(this),
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
  }

  createProject (project) {
    const slug = slugify(project.title)
    const sections = projectTemplate.sections.slice()

    // Require slug
    if (!slug || !slug.trim()) {
      return
    }

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
              const sectionListRef = database.ref(`projects/${slug}/sections`)

              const updates = {}
              let sectionRef, contentRef, sectionContent

              for (const section of sections) {
                sectionContent = section.content
                delete section.content

                // Add template sections
                sectionRef = sectionListRef.push(section)

                // Add template content
                for (const content of sectionContent) {
                  contentRef = database
                    .ref(`projects/${slug}/sections/${sectionRef.key}/content`)
                    .push()

                  const key = `projects/${slug}/sections/${
                    sectionRef.key
                  }/content/${contentRef.key}`

                  updates[key] = content
                }
              }

              database
                .ref()
                .update(updates)
                .then(() => {
                  window.location.href = `/${slug}`
                })
            })
        }
      })
  }

  createSection (section) {
    const slug = this.state.slug

    database.ref(`projects/${slug}/sections`).push(section)
  }

  updateSection (section) {
    const slug = this.state.slug
    const { content, id, ...newSection } = section

    database.ref(`projects/${slug}/sections/${id}`).update(newSection)
  }

  deleteSection (sectionId) {
    const slug = this.state.slug

    database
      .ref(`projects/${slug}/sections/${sectionId}`)
      .remove()
  }

  createContent (sectionId, content) {
    const slug = this.state.slug

    database.ref(`projects/${slug}/sections/${sectionId}/content`).push(content)
  }

  updateContent (sectionId, content) {
    const slug = this.state.slug
    const { id, ...newContent } = content

    database
      .ref(`projects/${slug}/sections/${sectionId}/content/${id}`)
      .update(newContent)
  }

  deleteContent (sectionId, contentId) {
    const slug = this.state.slug

    database
      .ref(`projects/${slug}/sections/${sectionId}/content/${contentId}`)
      .remove()
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
