import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Documents from './documents/Documents';
import AddDocument from './documents/AddDocument';
import Users from './users/Users';
import EditDocument from './documents/EditDocument';

const AppRoutes = () => (
  <Switch>
    <Route exact path='/' render={(props) => <Documents myDocuments={true} {...props} /> } />
    <Route exact path="/app/mydocuments" render={(props) => <Documents myDocuments={true} {...props} /> } />
    <Route exact path="/app/documents" render={(props) => <Documents myDocuments={false} {...props} /> } />
    <Route exact path='/app/documents/add' component={AddDocument} />
    <Route exact path='/app/documents/edit/:id' render={(props) => <EditDocument view={false} {...props} /> } />
    <Route exact path='/app/documents/view/:id' render={(props) => <EditDocument view={true} {...props} /> } />
    <Route exact path='/app/users' component={Users} />
  </Switch>
);

export default AppRoutes;
