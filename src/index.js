import React from 'react';
import ReactDOM from 'react-dom';
import localForage from 'localforage';
import * as serviceWorker from './serviceWorker';
import Application from './containers/Application';
import './styles/application.css';
import { Provider } from 'react-redux'
import { store } from './redux/store'
import './i18n/i18n';

try {
  localForage
    .config({
      driver: [localForage.INDEXEDDB, localForage.WEBSQL, localForage.LOCALSTORAGE],
      name: 'mydb',
      storeName: 'mystore',
      version: 3,
    })
    .then(() => localForage.getItem('x'));
} catch (e) {
  // console.log(e);
}

/* global document */
ReactDOM.render(
  <Provider store={store}>
    <Application />
  </Provider>, // eslint-disable-line react/jsx-filename-extension
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
