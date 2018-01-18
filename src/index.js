import './styles/styles.css'

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Switch, BrowserRouter, Route } from 'react-router-dom'

import registerServiceWorker from './registerServiceWorker'
import Page from './components/Page'

import routes from './routes'

class App extends Component {
  render () {
    return (
      <BrowserRouter>
        <Switch>
          <Page>
            {routes.map(({ path, component }) => (
              <Route path={path} exact component={component} key={path} />
            ))}
          </Page>
        </Switch>
      </BrowserRouter>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
