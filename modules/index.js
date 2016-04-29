import React from 'react'
import { findDOMNode } from 'react-dom'
import parsePath from 'history/lib/parsePath'

if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  history.scrollRestoration = 'manual'
}

const createKey = () => (
  Math.random().toString(36).substr(2, 6)
)

const addScrollKey = (locationOrString) => {
  const location = typeof locationOrString === 'string' ?
    parsePath(locationOrString) : locationOrString
  if (!location.state)
    location.state = {}
  location.state.__scrollKey = createKey()
  return location
}

export const useRouterRestoreScroll = () => ({
  renderRouterContext: (child, props) => (
    <RestoreWindowScroll
      router={props.router}
      location={props.location}
      children={child}
    />
  )
})

const RestoreWindowScroll = React.createClass({

  propTypes: {
    router: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired
  },

  componentDidUpdate(prevProps) {
    const { location } = this.props
    if (prevProps.location !== this.props.location) {
      if (location.action === 'PUSH' || location.action === 'REPLACE') {
        window.scrollTo(0, 0)
      } else {
        const { getScrollerPosition } = this.props.router.restoreScroll
        const position = getScrollerPosition('window')
        if (position) {
          const { scrollX, scrollY } = position
          window.scrollTo(scrollX, scrollY)
        }
      }
    }
  },

  render() {
    return this.props.children
  }
})

export const useHistoryRestoreScroll = (createHistory) => (
  (options={}) => {
    const initialScrollKey = createKey()
    let currentScrollKey = null

    const history = createHistory(options)

    // {
    //   [location.key]: {
    //     window: { scrollX, scrollY },
    //     [scrollKey]: { scrollTop, scrollLeft }
    //   },
    //   [location.key]: etc...
    // }
    const positionsByLocation = {}
    const scrollers = {}

    const push = (locationWithoutKey) => {
      const location = addScrollKey(locationWithoutKey)
      history.push(location)
    }

    const replace = (locationWithoutKey) => {
      const location = addScrollKey(locationWithoutKey)
      history.replace(location)
    }

    const registerScroller = (scrollKey, component) => {
      scrollers[scrollKey] = component
    }

    const unregisterScroller = (scrollKey) => {
      delete scrollers[scrollKey]
    }

    const getScrollerPosition = (componentScrollKey) => {
      const locationPositions = positionsByLocation[currentScrollKey]
      return locationPositions ? locationPositions[componentScrollKey] || null : null
    }

    const saveScrollerPositions = () => {
      if (!positionsByLocation[currentScrollKey])
        positionsByLocation[currentScrollKey] = {}
      const { scrollY, scrollX } = window
      savePosition('window', { scrollX, scrollY })
      for (const scrollKey in scrollers) {
        const scrollerComponent = scrollers[scrollKey]
        const { scrollTop, scrollLeft } = findDOMNode(scrollerComponent)
        savePosition(scrollKey, { scrollTop, scrollLeft })
      }
    }

    const savePosition = (scrollKey, position) => {
      positionsByLocation[currentScrollKey][scrollKey] = position
    }

    const unlisten = history.listen((location) => {
      saveScrollerPositions()
      currentScrollKey = (
        location.state && location.state.__scrollKey
      ) || initialScrollKey
    })

    const listen = (...args) => {
      const internalUnlisten = history.listen(...args)
      return () => unlisten() && internalUnlisten()
    }

    return {
      ...history,
      listen,
      push,
      replace,
      restoreScroll: {
        registerScroller,
        unregisterScroller,
        getScrollerPosition
      }
    }
  }
)

export const RestoreScroll = React.createClass({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  propTypes: {
    scrollKey: React.PropTypes.string.isRequired
  },

  componentDidMount() {
    const { registerScroller } = this.context.router.restoreScroll
    const { scrollKey } = this.props
    registerScroller(scrollKey, this)
    this.restoreScrollPosition()
  },

  componentWillUnmount() {
    const { unregisterScroller } = this.context.router.restoreScroll
    const { scrollKey } = this.props
    unregisterScroller(scrollKey)
  },

  restoreScrollPosition() {
    const { scrollKey } = this.props
    const { getScrollerPosition } = this.context.router.restoreScroll
    const position = getScrollerPosition(scrollKey)
    if (position) {
      const node = findDOMNode(this)
      const { scrollTop, scrollLeft } = position
      node.scrollTop = scrollTop
      node.scrollLeft = scrollLeft
    }
  },

  render() {
    return React.Children.only(this.props.children)
  }

})

