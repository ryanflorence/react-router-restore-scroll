# Updates for this fork

This is a fork of [ryanflorence/react-router-restore-scroll](https://github.com/ryanflorence/react-router-restore-scroll).

The above library seems to be unmaintained so I forked it to support React v16 and fix some other minor issues.

I recommend using node v8.1.2 and the latest npm version in order to use this version, and to use react-router@3.

## Major differences:
1. Removed deprecated usages of React.createClass and React.PropTypes in order to support React v16.
- Before
```javascript
import React from 'react'

const RestoreScroll = React.createClass({
...
  propTypes: {
    scrollKey: React.PropTypes.string.isRequired
  },
...
)}
```

- After
```javascript
import React from 'react'
import PropTypes from 'prop-types'
import createReactClass from 'create-react-class'

const RestoreScroll = createReactClass({
...
  propTypes: {
    scrollKey: PropTypes.string.isRequired
  },
...
)}
```

Referring to 
- https://facebook.github.io/react/blog/2017/04/07/react-v15.5.0.html#migrating-from-react.createclass
- https://facebook.github.io/react/blog/2017/04/07/react-v15.5.0.html#migrating-from-react.proptypes

2. Fixed this repo to directly allow installation with npm.
3. Fixed wrong link in ```package.json```
4. Fixed not restoring scroll for the first ```POP``` action.
5. Only save scroll position when ```PUSH``` or ```REPLACE``` action.

## How to use:
Add the following in your ```package.json```
```javascript
...
"react-router-restore-scroll": "git+https://github.com/jshin49/react-router-restore-scroll.git",
...
```


# Restore Scroll

Restore the scroll positions of `window` and scrollable elements when
the user navigates around a React Router app.

![demo](http://g.recordit.co/WTEvqRtWq9.gif)

## Temporarily a Plugin

Plan is to put this into React Router directly, but for now you can plug
it in and help us get the bugs out (and write some tests, there aren't
any yet!)

## Installation

```sh
npm install react-router-restore-scroll
```

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
import useHistoryRestoreScroll from 'react-router-restore-scroll/lib/useHistoryRestoreScroll'

const history = useHistoryRestoreScroll(createBrowserHistory)()

// call this when a scrollable element is inserted into the dom, where
// `scrollKey` is a globally unique identifier for the node
history.restoreScroll.registerScroller(scrollKey, domNode)

// call this when it's removed from the dom
history.restoreScroll.unregisterScroller(scrollKey)

// call this
// - when the app first renders
// - after the app re-renders after a location change
history.restoreScroll.restoreWindow()
```

You can look at `modules/RestoreWindowScroll.js` and `modules/RestoreScroll.js`
to see at which points in a React app these methods are all called.

We'll pull `useHistoryRestoreScroll` out into it's own package on npm
eventually so that this use-case isn't required to bring in stuff that
depends on React and React Router.

## Difference from [taion/scroll-behavior](https://github.com/taion/scroll-behavior)

- It ties into the router middleware to decide when to restore scroll
  positions so we don't need workarounds for async routes
- It restores scroll position of individual elements in addition to the
  window.
- It doesn't rely on `location.key` in preparation for history 3.0
- It does not have `shouldUpdateScroll`, but once [route is on
  context](https://github.com/reactjs/react-router/issues/3325) we'll be
able to implement [the old `ignoreScroll` route prop](https://github.com/gaearon/react-router/blob/edfe32086fe9373fe9653b0ef0aaec544eecd3d5/docs/api/components/Route.md#ignorescrollbehavior) or maybe a function like `shouldUpdateScroll` instead.

