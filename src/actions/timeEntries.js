import firebase from '../DatabaseConnection'
import * as types from '../Solide'
import {actionStart, actionSuccess, actionFailed} from './screener'

export const fetchList = (uid) => {
  return function(dispatch) {
    dispatch(actionStart(types.TIMEIN_FETCH_LIST))
    
    const ref = firebase.database().ref('timeEntries/' + uid)
    return new Promise((resolve, reject) => {

      // let getTagPromises = []
      ref.once('value', function(snapshot){
        let entries = {}
        snapshot.forEach(function(childSnapshot){
          var childKey = childSnapshot.key
          var childData = childSnapshot.val()
          childData.startTime = new Date(childData.startTime)
          childData.endTime = new Date(childData.endTime)
          childData.langId = childData.lang

          entries[childKey] = childData
        })

        //success when fetch all tags done
        dispatch(actionSuccess(types.TIMEIN_FETCH_LIST, {payload: {
          entries
        }}))
        resolve()

      })
    })
  }
}

export const remove = (uid, entryId) => {
  return function(dispatch) {
    dispatch(actionStart(types.TIMEIN_REMOVE, {payload: {entryId}}))
    
    const promise = firebase.database().ref('timeEntries/' + uid + '/' + entryId).remove()
    promise.then(function(){
      dispatch(actionSuccess(types.TIMEIN_REMOVE))
      dispatch(fetchList(uid))      
    })
    .catch(function(){
      dispatch(actionFailed(types.TIMEIN_REMOVE))
    })

  }
}