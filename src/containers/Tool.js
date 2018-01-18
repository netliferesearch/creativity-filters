import React from 'react'
import { Link } from 'react-router-dom'

export default function Tool () {
  return (
    <article>
      <h1>Honey, I'm hooome</h1>
      <Link to="/away">Go away</Link>
    </article>
  )
}
