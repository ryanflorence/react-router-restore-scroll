import React from 'react'
import createReactClass from 'create-react-class'

const RestoreWindowScroll = createReactClass({

  propTypes: {
    restoreWindow: React.PropTypes.func.isRequired,
    location: React.PropTypes.object.isRequired
  },

  componentDidMount() {
    this.props.restoreWindow(this.props.location)
  },

  componentDidUpdate(prevProps) {
    if (prevProps.location !== this.props.location)
      this.props.restoreWindow(this.props.location)
  },

  render() {
    return React.Children.only(this.props.children)
  }

})

export default RestoreWindowScroll
