import React from 'react'
import { findDOMNode } from 'react-dom'
import parsePath from 'history/lib/parsePath'

const setManualScroll = () => {
  if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
    history.scrollRestoration = 'manual'
  }
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

const RestoreWindowScroll = React.createClass({

  propTypes: {
    restoreScrollPosition: React.PropTypes.func.isRequired,
    location: React.PropTypes.object.isRequired
  },

  componentDidUpdate(prevProps) {
    const { location } = this.props
    if (prevProps.location !== this.props.location) {
      this.props.restoreScrollPosition('window', location)
    }
  },

  render() {
    return this.props.children
  }
})

const RestoreScroll = React.createClass({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  propTypes: {
    scrollKey: React.PropTypes.string.isRequired
  },

  componentDidMount() {
    const { registerScroller } = this.context.router.restoreScroll
    const { scrollKey } = this.props
    registerScroller(scrollKey, findDOMNode(this))
    this.restoreScrollPosition()
  },

  componentWillUnmount() {
    const { unregisterScroller } = this.context.router.restoreScroll
    const { scrollKey } = this.props
    unregisterScroller(scrollKey)
  },

  restoreScrollPosition() {
    const { restoreScrollPosition } = this.context.router.restoreScroll
    restoreScrollPosition(this.props.scrollKey)
  },

  render() {
    return React.Children.only(this.props.children)
  }

})

const useHistoryRestoreScroll = (createHistory) => (
  (options={}) => {
    setManualScroll()

    const initialScrollKey = createKey()
    let currentScrollKey = null

    const history = createHistory(options)

    ////
    // `positionsByLocation` looks like this
    //
    // ```
    // {
    //   [location.key]: {
    //     window: { scrollX, scrollY },
    //     [scrollKey]: { scrollTop, scrollLeft }
    //   },
    //   [location.key]: etc...
    // }
    // ```
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

    const registerScroller = (scrollKey, node) => {
      scrollers[scrollKey] = node
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
        const scrollerNode = scrollers[scrollKey]
        const { scrollTop, scrollLeft } = scrollerNode
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

    const restoreWindow = (location) => {
      if (location.action === 'PUSH' || location.action === 'REPLACE') {
        window.scrollTo(0, 0)
      } else {
        const position = getScrollerPosition('window')
        if (position) {
          const { scrollX, scrollY } = position
          window.scrollTo(scrollX, scrollY)
        }
      }
    }

    const restoreNode = (scrollKey) => {
      const position = getScrollerPosition(scrollKey)
      if (position) {
        const node = scrollers[scrollKey]
        const { scrollTop, scrollLeft } = position
        node.scrollTop = scrollTop
        node.scrollLeft = scrollLeft
      }
    }

    const restoreScrollPosition = (key, location) => {
      if (key === 'window') {
        restoreWindow(location)
      } else {
        restoreNode(key)
      }
    }

    return {
      ...history,
      listen,
      push,
      replace,
      restoreScroll: {
        registerScroller,
        unregisterScroller,
        getScrollerPosition,
        restoreScrollPosition
      }
    }
  }
)

const useRouterRestoreScroll = () => ({
  renderRouterContext: (child, props) => (
    <RestoreWindowScroll
      restoreScrollPosition={props.router.restoreScroll.restoreScrollPosition}
      location={props.location}
      children={child}
    />
  )
})

export {
  useHistoryRestoreScroll,
  useRouterRestoreScroll,
  RestoreScroll
}

