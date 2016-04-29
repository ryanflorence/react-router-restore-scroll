import React from 'react'

// getting that dumb warning even though it's used in the JSX!
/*eslint no-unused-vars: 0 */
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

