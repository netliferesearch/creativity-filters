import './index.css'

import React from 'react'
import PropTypes from 'prop-types'

import { withState } from '../../storage'

import BEMHelper from 'react-bem-helper'
const classes = new BEMHelper('new-section')

function NewSection ({ section, updateSection }) {
  return (
    <nav {...classes('')}>
      <button
        type="button"
        {...classes('option')}
        onClick={() =>
          updateSection({
            ...section,
            type: 'timeline',
          })
        }
      >
        Timeline
      </button>
      <button
        type="button"
        {...classes('option')}
        onClick={() =>
          updateSection({
            ...section,
            type: 'what-how-why',
          })
        }
      >
        What, How and Why
      </button>
      <button
        type="button"
        {...classes('option')}
        onClick={() =>
          updateSection({
            ...section,
            type: 'priority',
          })
        }
      >
        Prioritized list
      </button>
      <button
        type="button"
        {...classes('option')}
        onClick={() =>
          updateSection({
            ...section,
            type: 'sliders',
          })
        }
      >
        Sliders
      </button>
      <button
        type="button"
        {...classes('option')}
        onClick={() =>
          updateSection({
            ...section,
            type: 'plot',
          })
        }
      >
        Plot chart
      </button>
      <button
        type="button"
        {...classes('option')}
        onClick={() =>
          updateSection({
            ...section,
            type: 'swot',
          })
        }
      >
        SWOT
      </button>
    </nav>
  )
}

NewSection.propTypes = {
  updateSection: PropTypes.func.isRequired,
  section: PropTypes.object.isRequired,
}

export default withState(NewSection)
