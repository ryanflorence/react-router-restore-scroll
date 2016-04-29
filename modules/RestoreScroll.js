import React from 'react'
import { findDOMNode } from 'react-dom'

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

export default RestoreScroll

