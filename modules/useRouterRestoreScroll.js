import React from 'react'
import RestoreWindowScroll from './RestoreWindowScroll'

const useRouterRestoreScroll = () => ({
  renderRouterContext: (child, props) => (
    <RestoreWindowScroll
      restoreWindow={props.router.restoreScroll.restoreWindow}
      location={props.location}
      children={child}
    />
  )
})

export default useRouterRestoreScroll

