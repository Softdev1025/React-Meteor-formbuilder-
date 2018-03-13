import { Provider } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import { createStore, combineReducers } from 'redux'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute, Redirect } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

import Login from './components/login/'
import forgotPassword from './components/login/forgotPassword'
import SignUp from './components/signup/'
import Dashboard from './components/dashboard/'
import Management from './components/management/'
import userProfile from './components/userprofile/'
import confirmDetails from './components/userprofile/confirmDetails'
import bookMarks from './components/bookmarks'
import TaskService from './containers/Tasks'
import ActionServie from './containers/Actions'
import CollectionServie from './containers/Collectios'
import Action from './components/action/'
import Bankforms from './components/bankforms'

import reducers from './reducers/'

const reducer = combineReducers({
  ...reducers,
  routing: routerReducer
})

// Add the reducer to your store on the `routing` key
const store = createStore(reducer);

const history = syncHistoryWithStore(browserHistory, store)

$.event.props.push('dataTransfer');

Meteor.startup(function () {
  DashboardService(store);
  TaskService(store);
  ActionServie(store);
  CollectionServie(store);
  render(
    <Provider store={store}>
      <Router history={history}>
        <Route exact path="/" onEnter={() => browserHistory.push('/Login')} />
        <Route path="/login" component={Login} />
        <Route path="/forgot-password" component={forgotPassword} />
        <Route path="/signup" component={SignUp} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/dashboard/:name" component={Dashboard} />
        <Route path="/management/:name" component={Management} />
        <Route path="/action" component={Action} />
        <Route path="/user-profile" component={userProfile} />
        <Route path="/confirm-details" component={confirmDetails} />
        <Route path="/bookmarks" component={bookMarks} />
        <Route path="/bankforms" component={Bankforms} />
      </Router>
    </Provider>,
    document.getElementById('main')

  )
});

