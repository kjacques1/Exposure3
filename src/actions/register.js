import firebase from '../DatabaseConnection'
import * as types from '../Solide'
import {actionStart, actionFailed, actionSuccess} from './screener'

export const register = (email, password) => {
  return function(dispatch) {
    dispatch(actionStart(types.REGISTER))
    const promise = firebase.auth().createUserWithEmailAndPassword(email, password)
    promise.then((user) => {
      dispatch(actionSuccess(types.REGISTER, {user: user}))
    })
    .catch(function(error) {
      let errorMessage

      switch (error.code) {
        case 'auth/weak-password':
          errorMessage = 'The password is too weak.'
          break
        default:
          errorMessage = error.message
      }
      dispatch(actionFailed(types.REGISTER, errorMessage))
    })
    //return promise so github.com/arnaudbenard/redux-mock-store works
    return promise
  }
}