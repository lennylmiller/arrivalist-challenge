import { computed } from 'mobx'

const SNACKBAR_HEIGHT = 50
const FAB_HEIGHT = 24

class FabButton {

  _store

  @computed get iframePageInfo() {
    return this._store.iframePageInfo
  }

  @computed get snackbarVisible() {
    return this._store.snackbarVisible
  }

  @computed get bottom() {
    if (this.iframePageInfo) {
      const {
        offsetTop,
        scrollTop,
        iframeHeight,
        clientHeight
      } = this.iframePageInfo
      const bottom = Math.max(offsetTop + iframeHeight - clientHeight - scrollTop + FAB_HEIGHT, 0)

      return this.snackbarVisible
        ? bottom + SNACKBAR_HEIGHT
        : bottom
    }

    return this.snackbarVisible
      ? SNACKBAR_HEIGHT
      : 0
  }

  @computed get leftMargin() {
    return this._store.width <= this._maxWidth
      ?  0
      : (this._store.width - this._maxWidth) / 2
  }

  constructor({ store, maxWidth }) {
    this._store = store
    this._maxWidth = maxWidth
  }
}

export default FabButton
