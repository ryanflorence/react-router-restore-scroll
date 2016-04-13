/*eslint no-console: 0*/
import React from 'react'
import { findDOMNode } from 'react-dom'

if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  history.scrollRestoration = 'manual'
}

export const useRestoreScroll = () => ({
  renderRootContainer: (props) => (
    <RestoreScrollContainer {...props}/>
  )
})

const { shape, func, string } = React.PropTypes

const restoreScrollContextType = {
  restoreScroll: shape({
    registerScroller: func,
    getPosition: func
  }).isRequired
}

const RestoreScrollContainer = React.createClass({

  childContextTypes: restoreScrollContextType,

  getChildContext() {
    return { restoreScroll: {
      registerScroller: (scrollKey, component) => {
        console.log('registerScroller', scrollKey)
        this.scrollers[scrollKey] = component
      },
      unregisterScroller: (scrollKey) => {
        console.log('unregisterScroller', scrollKey)
        delete this.scrollers[scrollKey]
      },
      getPosition: this.getPosition
    } }
  },

  componentWillMount() {
    // {
    //   [location.key]: {
    //     window: { scrollX, scrollY },
    //     [scrollKey]: { scrollTop, scrollLeft }
    //   },
    //   [location.key]: etc...
    // }
    this.positionsByLocation = {}
    this.scrollers = {}
    this.updateScrollOnUpdate = false
  },

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps')
    if (nextProps.location !== this.props.location) {
      this.saveScrollerPositions()
    }
  },

  getPosition(scrollKey) {
    const { positionsByLocation } = this
    const { key } = this.props.location
    const locationPositions = positionsByLocation[key]
    return locationPositions ? locationPositions[scrollKey] || null : null
  },

  savePosition(scrollKey, position) {
    console.log('savePosition', scrollKey, position)
    this.positionsByLocation[this.props.location.key][scrollKey] = position
  },

  saveScrollerPositions() {
    console.log('saveScrollerPositions')
    const { positionsByLocation, scrollers } = this
    const { key } = this.props.location

    if (!positionsByLocation[key])
      positionsByLocation[key] = {}

    const { scrollY, scrollX } = window
    this.savePosition('window', { scrollX, scrollY })

    for (const scrollKey in scrollers) {
      const scrollerNode = scrollers[scrollKey]
      const { scrollTop, scrollLeft } = findDOMNode(scrollerNode)
      this.savePosition(scrollKey, { scrollTop, scrollLeft })
    }
  },

  componentDidUpdate(prevProps) {
    if (prevProps.location !== this.props.location) {
      const position = this.getPosition('window')
      if (position) {
        const { scrollX, scrollY } = position
        window.scrollTo(scrollX, scrollY)
      }
    }
  },

  render() {
    const { render, ...props } = this.props
    return render(props)
  }

})

export const RestoreScroll = React.createClass({

  contextTypes: restoreScrollContextType,

  propTypes: {
    scrollKey: string.isRequired
  },

  componentDidMount() {
    const { registerScroller } = this.context.restoreScroll
    const { scrollKey } = this.props
    registerScroller(scrollKey, this)
    this.restoreScrollPosition()
  },

  componentWillUnmount() {
    const { unregisterScroller } = this.context.restoreScroll
    const { scrollKey } = this.props
    unregisterScroller(scrollKey)
  },

  restoreScrollPosition() {
    const { scrollKey } = this.props
    const { getPosition } = this.context.restoreScroll
    const position = getPosition(scrollKey)
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

