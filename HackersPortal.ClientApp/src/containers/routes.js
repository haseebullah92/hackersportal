import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import App from './app/App';
import Account from './account/Account';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    JSON.parse(localStorage.getItem('auth'))
      ? <Component {...props} />
      : <Redirect to={{
        pathname: '/account/login',
        state: { from: props.location }
      }} />
  )} />
)

const PublicRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    !JSON.parse(localStorage.getItem('auth'))
      ? <Component {...props} />
      : <Redirect to={{
        pathname: '/',
        state: { from: props.location }
      }} />
  )} />
)

const RootRoutes = () => (
  <Switch>
    <PrivateRoute exact path='/' component={App} />
    <PrivateRoute path='/app' component={App} />
    <PublicRoute path='/account' component={Account} />
  </Switch>
);

export default RootRoutes;
