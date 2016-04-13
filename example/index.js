import React from 'react'
import { render, findDOMNode } from 'react-dom'
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router'
import applyMiddleware from 'react-router-apply-middleware'
import { useRestoreScroll, RestoreScroll } from 'react-router-restore-scroll'

const App = React.createClass({
  render() {
    return (
      <div style={{ fontFamily: 'sans-serif', fontWeight: '200' }}>
        <h1>Restore Scroll!</h1>
        <ul>
          <li><Link to="/">Index</Link></li>
          <li><Link to="/page/1">Page 1</Link></li>
          <li><Link to="/page/2">Page 2</Link></li>
        </ul>
        {this.props.children}
      </div>
    )
  }
})

const Index = React.createClass({
  render() {
    return (
      <div>
        <h2>Index</h2>
        <RestoreScroll scrollKey="one">
          <div style={{ height: '200px', overflow: 'auto', border: '1px solid' }}>
            <p style={{ height: '100px' }}>scroll me</p>
            <p style={{ height: '100px' }}>two</p>
            <p style={{ height: '100px' }}>three</p>
          </div>
        </RestoreScroll>
      </div>
    )
  }
})

const Page = React.createClass({
  render() {
    const { page } = this.props.params
    return (
      <div>
        <h2>Chapter {page}</h2>
        <p style={{ height: '50vh' }}>scroll down</p>
        <p style={{ height: '50vh' }}>one</p>
        <p style={{ height: '50vh' }}>two</p>
        <p style={{ height: '50vh' }}>click the back button</p>
      </div>
    )
  }
})

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={Index}/>
    <Route path="page/:page" component={Page}/>
  </Route>
)

render(
  <Router
    render={applyMiddleware(useRestoreScroll())}
    history={browserHistory}
    routes={routes}
  />,
  document.getElementById('app')
)

