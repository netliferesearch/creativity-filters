import './styles/styles.css'

import React, { Component, createContext } from 'react'
import { withRouter } from 'react-router-dom'
import { format } from 'date-fns'
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
      title: 'Se fremover',
      type: 'timeline',
      content: [
        { year: '5 år', content: '' },
        { year: '10 år', content: '' },
        { year: '15 år', content: '' },
      ],
    },
    {
      title: 'Verdibasert, overordnet mål',
      type: 'what-how-why',
      content: [
        { title: 'Hva', content: '' },
        { title: 'Hvordan', content: '' },
        { title: 'Hvorfor', content: '' },
      ],
    },
    {
      title: 'Målgruppe',
      type: 'priority',
      content: [{ content: '' }],
    },
    {
      title: 'Publikum',
      type: 'priority',
      content: [{ content: '' }],
    },
    {
      title: 'Top 3 verdier',
      type: 'priority',
      content: [{ content: '' }],
    },
    {
      title: 'Personlighet',
      type: 'sliders',
      content: [
        { from: 'Elite', to: 'Til massene', value: 50 },
        { from: 'Seriøs', to: 'Leken', value: 50 },
        { from: 'Konvensjonell', to: 'Rebell', value: 50 },
        { from: 'Venn', to: 'Autoritet', value: 50 },
        { from: 'Moden', to: 'Ung', value: 50 },
      ],
    },
    {
      title: 'Konkurrenter og posisjon',
      type: 'plot',
      content: [
        {
          x: ['Klassisk', 'Moderne'],
          y: ['Utryksfull', 'Subtil'],
          items: [{ content: 'Deg', x: 55, y: 55 }],
        },
      ],
    },
  ],
}

const initialStore = {
  slug: '',
  project: {
    title: '',
  },
  sections: [],
  grid: false,
}

class Storage extends Component {
  static propTypes = {
    children: PropTypes.any,
    location: PropTypes.object,
  }

  state = {
    ...initialStore,
    createProject: this.createProject.bind(this),
    createSection: this.createSection.bind(this),
    updateSection: this.updateSection.bind(this),
    deleteSection: this.deleteSection.bind(this),
    createContent: this.createContent.bind(this),
    updateContent: this.updateContent.bind(this),
    deleteContent: this.deleteContent.bind(this),
    toggleGrid: this.toggleGrid.bind(this),
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

  toggleGrid () {
    this.setState({
      grid: !this.state.grid,
    })
  }

  loadProjectData () {
    const slug = this.props.location.pathname.split('/')[1]

    this.setState({ slug })

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

    // project.createdDate = new Date() // TODO

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
            .set({
              ...project,
              createdDate: format(new Date(), 'YYYY-MM-DD, H:mm'),
            })
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

    database.ref(`projects/${slug}/sections/${sectionId}`).remove()
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
