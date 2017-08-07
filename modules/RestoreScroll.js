import React from 'react'
import createReactClass from 'create-react-class'
import { findDOMNode } from 'react-dom'

const RestoreScroll = createReactClass({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  propTypes: {
    scrollKey: React.PropTypes.string.isRequired
  },

  componentDidMount() {
    const { registerScroller } = this.context.router.restoreScroll
    registerScroller(this.props.scrollKey, findDOMNode(this))
  },

  componentWillUnmount() {
    const { unregisterScroller } = this.context.router.restoreScroll
    unregisterScroller(this.props.scrollKey)
  },

  render() {
    return React.Children.only(this.props.children)
  }

})

export default RestoreScroll
