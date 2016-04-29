# Restore Scroll

Restore the scroll positions of `window` and scrollable elements when
the user navigates around a React Router app.

![demo](http://g.recordit.co/WTEvqRtWq9.gif)

## Temporarily a Plugin

Plan is to put this into React Router directly, but for now you can plug
it in and help us get the bugs out (and write some tests, there aren't
any yet!)

## Usage

```js
import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory, applyRouterMiddleware } from 'react-router'
import routes from './routes'

import {
  useHistoryRestoreScroll,
  useRouterRestoreScroll
} from 'react-router-restore-scroll'

// first enhance a history
const createHistory = useHistoryRestoreScroll(() => browserHistory)

// next create some router middleware
const routerRender = applyRouterMiddleware(
  useRouterRestoreScroll()
)

// then plug them into Router
render(
  <Router
    history={createHistory()}
    render={routerRender}
    routes={routes}
  />,
  document.getElementById('app')
)
```

Now the window's scroll positions will be automatically restored as you
navigate around in a React Router app, and even when you navigate out of
and back into it from external sites.

## Restores Scrollable Elements Too

If you’ve got scrollable elements (`overflow: auto|scroll`) they can
also be restored with the `RestoreScroll` component.

```js
import { RestoreScroll } from 'react-router-restore-scroll'

// then in a component's render method, wrap your scrollable element
// in a `RestoreScroll` component. It needs a `scrollKey`.
<RestoreScroll scrollKey="one">
  <div style={{ height: '200px', overflow: 'auto', border: '1px solid' }}>
    <div style={{ height: '100px', background: 'hsl(0, 50%, 90%)' }}>scroll me</div>
    <div style={{ height: '100px', background: 'hsl(100, 50%, 90%)' }}>two</div>
    <div style={{ height: '100px', background: 'hsl(200, 50%, 90%)' }}>three</div>
  </div>
</RestoreScroll>
```

## Non-React usage

The `useHistoryRestoreScroll` enhancer gives you a history with a
`restoreScroll` property with three methods that you can use to
integrate into any view layer that uses `history` (cycle.js, etc.).

```js
import createBrowserHistory from 'history/lib/createBrowserHistory'

const history = useHistoryRestoreScroll(createBrowserHistory)()

// call this when a scrollable element is inserted into the dom, where
// `scrollKey` is a globally unique identifier for the node
history.registerScroller(scrollKey, domNode)

// call this when it's removed from the dom
history.unregisterScroller(scrollKey)

// call this
// - when the app first renders
// - after the app re-renders after a location change
history.restoreWindow()
```

You can look at `modules/RestoreWindowScroll.js` and `modules/RestoreScroll.js`
to see at which points in a React app these methods are all called.

