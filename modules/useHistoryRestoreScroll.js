import { parsePath } from 'history/lib/PathUtils'

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

const useHistoryRestoreScroll = (createHistory) => (
  (options={}) => {
    setManualScroll()

    const scrollableNodes = {}

    // TODO: safer sessionStorage stuff
    const positionsByLocation = (
      sessionStorage.positionsByLocation && (
        JSON.parse(sessionStorage.positionsByLocation)
      )
    ) || {}

    const initialScrollKey = sessionStorage.initialScrollKey || createKey()
    let currentScrollKey = sessionStorage.currentScrollKey || initialScrollKey
    let first = true

    window.addEventListener('beforeunload', () => {
      saveScrollPositions()
      sessionStorage.positionsByLocation = JSON.stringify(positionsByLocation)
      sessionStorage.currentScrollKey = currentScrollKey
      sessionStorage.initialScrollKey = initialScrollKey
    })

    const history = createHistory(options)

    const push = (locationWithoutKey) => {
      const location = addScrollKey(locationWithoutKey)
      history.push(location)
    }

    const replace = (locationWithoutKey) => {
      const location = addScrollKey(locationWithoutKey)
      history.replace(location)
    }

    const registerScroller = (scrollKey, node) => {
      scrollableNodes[scrollKey] = node
      restoreNode(scrollKey)
    }

    const unregisterScroller = (scrollKey) => {
      delete scrollableNodes[scrollKey]
    }

    const getScrollerPosition = (componentScrollKey) => {
      const locationPositions = positionsByLocation[currentScrollKey]
      return locationPositions ? locationPositions[componentScrollKey] || null : null
    }

    const saveScrollPositions = () => {
      if (!positionsByLocation[currentScrollKey])
        positionsByLocation[currentScrollKey] = {}
      const { scrollY, scrollX } = window
      savePosition('window', { scrollX, scrollY })
      for (const scrollKey in scrollableNodes) {
        const scrollerNode = scrollableNodes[scrollKey]
        const { scrollTop, scrollLeft } = scrollerNode
        savePosition(scrollKey, { scrollTop, scrollLeft })
      }
    }

    const savePosition = (scrollKey, position) => {
      positionsByLocation[currentScrollKey][scrollKey] = position
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
        const node = scrollableNodes[scrollKey]
        const { scrollTop, scrollLeft } = position
        node.scrollTop = scrollTop
        node.scrollLeft = scrollLeft
      }
    }

    const unlisten = history.listen((location) => {
      if (first) {
        first = false
      } else {
        saveScrollPositions()
      }
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
        restoreWindow
      }
    }
  }
)

export default useHistoryRestoreScroll

