import React, { Component } from 'react';
import RootRoutes from './routes';
import fetchIntercept from 'fetch-intercept';
import { Redirect } from 'react-router-dom';

fetchIntercept.register({
  request: function (url, config) {
    // Modify the url or config here
    let auth = JSON.parse(localStorage.getItem('auth'));
    if (auth && auth.token) {
      config.headers.Authorization = 'Bearer ' + auth.token;
    }
    return [url, config];
  },

  requestError: function (error) {
    // Called when an error occured during another 'request' interceptor call
    return Promise.reject(error);
  },

  response: function (response) {
    if (response.status == 401) {
      localStorage.removeItem('auth');
      return <Redirect to="/" />;
    }
    if (!response.ok) {
      return Promise.reject(response);
    } 
    // Modify the reponse object
    return response;
  },

  responseError: function (error) {
    // Handle an fetch error
    return Promise.reject(error);
  }
});

class Root extends Component {

  render() {
    return (
      <RootRoutes />
    );
  }
}

export default Root;
