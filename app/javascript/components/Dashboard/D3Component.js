import React from 'react'

class D3Component extends React.Component {

  initialize() {}
  update(prevProps, prevState) {}
  destroy() {}

  componentDidMount() {
    this.initialize()
    this.update()
  }

  componentDidUpdate(prevProps, prevState) {
    this.update(prevProps, prevState)
  }

  componentWillUnmount() {
    this.destroy()
  }

  render() {
    const { style } = this.props
    return (
      <svg ref="svg" style={style} />
    )
  }
}

export default D3Component

