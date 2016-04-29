import React from 'react'
import RestoreWindowScroll from './RestoreWindowScroll'

const useRouterRestoreScroll = () => ({
  renderRouterContext: (child, props) => (
    <RestoreWindowScroll
      restoreScrollPosition={props.router.restoreScroll.restoreScrollPosition}
      location={props.location}
      children={child}
    />
  )
})

export default useRouterRestoreScroll

