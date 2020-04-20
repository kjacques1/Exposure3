import firebase from '../DatabaseConnection'
import * as types from '../Solide'
import {actionStart, actionSuccess, actionFailed} from './screener'

export const fetchList = (uid) => {
  return function(dispatch) {
    dispatch(actionStart(types.LANGS_FETCH_LIST))
    
    const ref = firebase.database().ref('langs/' + uid)
    return new Promise(function(resolve, reject){
      ref.once('value', function(snapshot){
        let entries = []
        snapshot.forEach(function(childSnapshot){
          entries.push(Object.assign(childSnapshot.val(), {key : childSnapshot.key}))
        })
        dispatch(actionSuccess(types.LANGS_FETCH_LIST, {payload: entries}))

        resolve()
      })
    })
  }
}


const assignLangToEntry = (dispatch, uid, langName, langColor, assignFn) => {
  //use existed tag
  const ref = firebase.database().ref('langs/' + uid)
    .orderByChild('name')
      .startAt(langName)
      .endAt(langName)

  ref.once('value', function(snapshot){
    let langs = snapshot.val()
    //tag exist so return error
    if (langs) {
      const langId = Object.keys(langs)[0]
      assignFn(langId)
    } else {
      const lang = {
        name: langName,
        color: langColor
      }        
      //create tag
      const newLangPromise = firebase.database().ref('langs/' + uid).push(lang)
      const langId = newLangPromise.key
      newLangPromise
      .then(() => {
        assignFn(langId)
        dispatch(fetchList(uid))
      })      
    }
  })  
}

export const assignLangToTimeEntryInput = (uid, langName, langColor) => {
  return function(dispatch) {
    const assignFn = (langId) => {
      //assign tag to entry
      const promise = firebase.database().ref('timeEntryInputs/' + uid).update({lang: langId})
      promise
      .then(() => {
        dispatch(actionSuccess(types.TIME_ENTRY_INPUT__ASSIGN_LANG, {payload: {
          langId
        }}))
      })
      .catch(() => {
        dispatch(actionFailed(types.TIME_ENTRY_INPUT__ASSIGN_LANG))  
      })
    }

    dispatch(actionStart(types.TIME_ENTRY_INPUT__ASSIGN_LANG))

    assignLangToEntry(dispatch, uid, langName, langColor, assignFn)
  }
}

export const assignLangIdToTimeEntryInput = (uid, langId) => {
  return dispatch => {
    dispatch(actionStart(types.TIME_ENTRY_INPUT__ASSIGN_LANG_ID, {payload: {
      langId
    }}))

    const promise = firebase.database().ref('timeEntryInputs/' + uid).update({lang: langId})

    promise
    .then(() => {      
      firebase.database().ref('langs/' + uid + '/' + langId).once('value', (snapshot) => {
        dispatch(actionSuccess(types.TIME_ENTRY_INPUT__ASSIGN_LANG_ID, {payload: {
          langId
        }}))
      })
    })
    .catch(() => {
      dispatch(actionFailed(types.TIME_ENTRY_INPUT__ASSIGN_LANG_ID))  
    })

    return promise
  }
}

export const assignLangToTimeEntry = (uid, entryId, langName, langColor) => {
  return function(dispatch) {
    const assignFn = (langId) => {
      //assign tag to entry
      const promise = firebase.database().ref('timeEntries/' + uid + '/' + entryId).update({lang: langId})
      promise
      .then(() => {
        dispatch(actionSuccess(types.TIMEIN__ASSIGN_LANG, {payload: {
          langId,
          entryId
        }}))
      })
      .catch(() => {
        dispatch(actionFailed(types.TIMEIN__ASSIGN_LANG))  
      })
    }

    dispatch(actionStart(types.TIMEIN__ASSIGN_LANG))

    assignLangToEntry(dispatch, uid, langName, langColor, assignFn)
  }
}

export const assignLangIdToTimeEntry = (uid, entryId, langId) => {
  return dispatch => {
    dispatch(actionStart(types.TIMEIN__ASSIGN_LANG_ID))

    const promise = firebase.database().ref('timeEntries/' + uid + '/' + entryId).update({lang: langId})

    promise
    .then(() => {      
      firebase.database().ref('langs/' + uid + '/' + langId).once('value', (snapshot) => {
        dispatch(actionSuccess(types.TIMEIN__ASSIGN_LANG_ID, {payload: {
          langId,
          entryId
        }}))
      })
    })
    .catch(() => {
      dispatch(actionFailed(types.TIMEIN__ASSIGN_LANG_ID))  
    })

    return promise
  }
}