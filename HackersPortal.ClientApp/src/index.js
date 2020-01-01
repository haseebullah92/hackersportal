import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';


import 'bootstrap/dist/css/bootstrap.css';
import './styles/sb-admin.css';
import Root from './containers/Root';

const rootEl = document.getElementById('root')

ReactDOM.render(
  <BrowserRouter>
    <Root />
  </BrowserRouter>,
  rootEl
);
registerServiceWorker();

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NextApp = require('./containers/Root').default
    ReactDOM.render(
      <BrowserRouter>
        <NextApp />
      </BrowserRouter>,
      rootEl
    )
  })
}