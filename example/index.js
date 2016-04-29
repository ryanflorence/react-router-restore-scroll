import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router'
import applyRouterMiddleware from 'react-router/lib/applyRouterMiddleware'
import {
  useHistoryRestoreScroll,
  useRouterRestoreScroll,
  RestoreScroll
} from 'react-router-restore-scroll'

const App = React.createClass({
  render() {
    return (
      <div style={{ fontFamily: 'sans-serif', fontWeight: '200' }}>
        <h1>Restore Scroll!</h1>
        <ul>
          <li><Link to="/">Index</Link></li>
          <li><Link to="/page/1">Page 1</Link></li>
          <li><Link to="/page/2">Page 2</Link></li>
          <li><a href="https://example.com">external</a></li>
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
            <div style={{ height: '200px', background: 'hsl(0, 50%, 90%)' }}>scroll me</div>
            <div style={{ height: '200px', background: 'hsl(100, 50%, 90%)' }}>two</div>
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
        <div style={{ height: '50vh', background: 'hsl(0, 50%, 90%)' }}>scroll down</div>
        <div style={{ height: '50vh', background: 'hsl(100, 50%, 90%)' }}>one</div>
        <div style={{ height: '50vh', background: 'hsl(200, 50%, 90%)' }}>two</div>
        <div style={{ height: '50vh', background: 'hsl(300, 50%, 90%)' }}>click the back button</div>
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
    history={useHistoryRestoreScroll(() => browserHistory)()}
    render={applyRouterMiddleware(useRouterRestoreScroll())}
    routes={routes}
  />,
  document.getElementById('app')
)

