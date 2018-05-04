import React from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

import { withState } from '../../storage'

function Meta ({ slug, project }) {
  const { title } = project
  return <Helmet>{slug && title && <title>{title}</title>}</Helmet>
}

Meta.propTypes = {
  slug: PropTypes.string,
  project: PropTypes.object,
}

export default withState(Meta)
