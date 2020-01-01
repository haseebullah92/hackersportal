import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from './login/Login';

const AccountRoutes = () => (
  <Switch>
    <Route exact path='/' component={Login} />
    <Route path='/account/login' component={Login} />
  </Switch>
);

export default AccountRoutes;
