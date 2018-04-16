import './styles/styles.css'

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Switch, BrowserRouter, Route } from 'react-router-dom'

import { Storage } from './storage'
import registerServiceWorker from './registerServiceWorker'
import Page from './components/Page'
import Tool from './components/Tool'

class App extends Component {
  render () {
    return (
      <BrowserRouter>
        <Switch>
          <Page>
            <Route path="/:page" exact component={Tool} />
            <Route path="/" exact component={Tool} />
          </Page>
        </Switch>
      </BrowserRouter>
    )
  }
}

ReactDOM.render(
  <Storage>
    <App />
  </Storage>,
  document.getElementById('root')
)

registerServiceWorker()
