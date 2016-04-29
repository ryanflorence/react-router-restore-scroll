import React from 'react'

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

export default RestoreWindowScroll

