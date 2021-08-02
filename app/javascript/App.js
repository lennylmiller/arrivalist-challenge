import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {Provider} from 'mobx-react'
import {makeStyles, MuiThemeProvider} from '@material-ui/core/styles'
import Header from './components/Header'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import muiTheme from './components/muiTheme'
import stores from './stores'
import {Redirect, Route, Switch} from "react-router-dom"
import Dashboard from "./components/Dashboard"
import PageNotFound from "./components/PageNotFound"
import MomentUtils from "@date-io/moment"
import {MuiPickersUtilsProvider} from "@material-ui/pickers"

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    flex: 1
  }
}))

function App() {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Provider {...stores}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Router>,
            <MuiThemeProvider theme={muiTheme}>
              <CssBaseline/>
              <Container maxWidth="md">
                <Header/>
                <Switch>
                  <Route exact path="/" component={Dashboard}/>
                  <Route path="/404" component={PageNotFound}/>
                  <Redirect to="/404"/>
                </Switch>
              </Container>
            </MuiThemeProvider>
          </Router>
        </MuiPickersUtilsProvider>
      </Provider>
    </div>
  )
}

export default App
