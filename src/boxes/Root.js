import React, {PropTypes} from 'react'

import {Provider} from 'react-redux'
import {Router, Route, IndexRoute} from 'react-router'

import App from './App'
import Welcome from '../components/Welcome'
import Report from '../components/Report'
import ExposureMapping from '../components/ExposureMapping'
import CheckAuth from './CheckAuth'
import Login from './auth/Login'
import Register from './auth/Register'
import SendPasswordResetEmail from './auth/SendPasswordResetEmail'
import VerifyPasswordResetCode from './auth/VerifyPasswordResetCode'

const Root = ({store, history, requireAuth}) => (
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App}>
        <IndexRoute component={ExposureMapping} onEnter={requireAuth} />
        <Route path='/check-auth' component={CheckAuth} />
        <Route path='/tracker' component={ExposureMapping} onEnter={requireAuth} />
        <Route path='/report' component={Report} onEnter={requireAuth} />
        <Route path='/Welcome' component={Welcome} onEnter={requireAuth} />
        <Route path='/login' component={Login} />
        <Route path='/request-reset-password' component={SendPasswordResetEmail} />
        <Route path='/reset-password' component={VerifyPasswordResetCode} />
        <Route path='/register' component={Register} />
      </Route>    
    </Router>
  </Provider>
)

Root.propTypes = {
  history: PropTypes.object.isRequired
}

export default Root