import React from 'react'
import {observer} from 'mobx-react'
import withStyles from '@material-ui/core/styles/withStyles'
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = theme => ({
  '@global': {
    body: {
      backgroundColor: theme.mode !== 'Tiles' && theme.palette.background.default
    }
  },
  // IE11 minHeight hack (use parent wiith display flex)
  parent: {
    display: 'flex'
  },
  root: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

@withStyles(styles)
@observer
class SpinnerPanel extends React.Component {

  render() {
    const {
      classes,
      minWidth = 0,
      minHeight = 350
    } = this.props
    return (
      <div className={classes.parent}>
        <div
          className={classes.root}
          style={{
            minWidth: minWidth,
            minHeight: minHeight
          }}>
          <CircularProgress/>
        </div>
      </div>
    )
  }
}

export default SpinnerPanel
