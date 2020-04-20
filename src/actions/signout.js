import firebase from '../DatabaseConnection'
import history from '../history'
import * as types from '../Solide'
import {actionStart, actionFailed, actionSuccess} from './screener'

export const signout = () => {
  return function(dispatch) {
    dispatch(actionStart(types.SIGNOUT))
    
    const promise = firebase.auth().signOut()
    promise.then(function(){
      dispatch(actionSuccess(types.SIGNOUT))
      history.push('/login')
    })
    .catch(function(){
      dispatch(actionFailed(types.SIGNOUT))
    })

    //return promise so github.com/arnaudbenard/redux-mock-store works
    return promise
  }
}