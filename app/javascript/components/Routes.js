import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard'
import PageNotFound from './PageNotFound'

export const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={ Dashboard }/>
      <Route path="/404" component={ PageNotFound }/>
      <Redirect to="/404"/>
    </Switch>
  )
}

