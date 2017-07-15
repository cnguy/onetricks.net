/* eslint-env browser */

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import 'babel-polyfill';

import './index.css';

import App from './App';

import miscReducer from './redux/misc';

const rootReducer = combineReducers({
  misc: miscReducer,
});

const store = createStore(rootReducer, {
}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
