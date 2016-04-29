/*eslint-env mocha*/
import expect from 'expect'

describe('useHistoryRestoreScroll', () => {
  it('exits correctly', () => {
    expect(true).toBe(true)
  })
  describe('intial history entry', () => {
    it('restores window scroll when going back to it')
    it('restores window scroll when going back from a different domain')
    it('restores different positions for different entries in the history of the same url')
  })

  describe('second history entry', () => {
    // we don't control location.state on the first entry but we do for the
    // rest of them, so we have to have some code to workaround that, thus, two
    // sets of tests for the same stuff since
    it('restores window scroll when going back')
    it('restores window scroll when going back from a different domain')
    it('restores different positions for different entries in the history of the same url')
  })

})

describe('RestoreScroll', () => {
  it('restores scroll positions of scrollable elements')
})

