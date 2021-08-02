import React from 'react'
import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(6)
  },
}))

const PageNotFound = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <h1>404-Page not found.</h1>
    </div>
  )
}

export default PageNotFound
