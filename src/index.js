import './styles/styles.css'

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Switch, BrowserRouter, Route } from 'react-router-dom'

import Storage from './storage'
import registerServiceWorker from './registerServiceWorker'
import Meta from './components/Meta'
import Home from './components/Home'
import Page from './components/Page'
import Tool from './components/Tool'

class App extends Component {
  render () {
    return (
      <BrowserRouter>
        <Switch>
          <Storage>
            <Meta />
            <Page>
              <Route path="/:slug" exact component={Tool} />
              <Route path="/:slug/:sectionSlug" exact component={Tool} />
              <Route path="/" exact component={Home} />
            </Page>
          </Storage>
        </Switch>
      </BrowserRouter>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))

registerServiceWorker()
