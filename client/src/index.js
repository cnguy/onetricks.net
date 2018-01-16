/* eslint-env browser */

import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import 'babel-polyfill'

import './index.css'

import App from './App'

import championPaneReducer from './redux/championPane'
import miscReducer from './redux/misc'
import playersViewReducer from './redux/playersView'

const rootReducer = combineReducers({
    championPane: championPaneReducer,
    misc: miscReducer,
    playersView: playersViewReducer,
})

const store = createStore(
    rootReducer,
    {},
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__(),
)

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'),
)
