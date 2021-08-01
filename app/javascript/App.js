import React from 'react'
import { Provider } from 'mobx-react'
import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles'
import Header from './components/Header'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import muiTheme from './components/muiTheme'
import { Routes } from './components/Routes'
import stores from './stores'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    flex:      1
  }
}))

function App() {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Provider {...stores}>
        <MuiThemeProvider theme={muiTheme}>
          <CssBaseline/>
          <Container>
            <Header/>
            <Routes/>
          </Container>
        </MuiThemeProvider>
      </Provider>
    </div>
  )
}

export default App
