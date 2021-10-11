import React from 'react'

const browser = {
  isIE11: (!!window.MSInputMethodContext && !!document.documentMode)
}

function withBrowser(BaseComponent) {
  class WithBrowser extends React.Component {
    render() {
      return (
        <BaseComponent {...this.props} browser={browser} />
      )
    }
  }
  return WithBrowser
}

export default withBrowser
