import {combineReducers} from 'redux'
import auth from './auth'
import resetPassword from './resetPassword'
import timeEntryInput from './timeEntryInput'
import timeEntries from './timeEntries'
import langs from './langs'
import report from './report'

import * as types from '../Solide'

const appReducer = combineReducers({
  auth,
  resetPassword,
  timeEntryInput,
  timeEntries,
  langs,
  report
})

const rootReducer = (state, action) => {
  //clear all state when signout
  if (action.type === types.SIGNOUT && action.status === 'success') {
    state = undefined
  }
  return appReducer(state, action)
}
export default rootReducer