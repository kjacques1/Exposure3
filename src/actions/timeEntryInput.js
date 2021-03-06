import firebase from '../DatabaseConnection'
import * as types from '../Solide'
import {actionStart, actionFailed, actionSuccess} from './screener'
import {fetchList} from './timeEntries'

export const modText = (uid, text) => {
  return function(dispatch) {
    dispatch(actionStart(types.TIME_ENTRY_INPUT__CHANGE_TEXT, {payload: {
        text
      }}))
    
    const promise = firebase.database().ref('timeEntryInputs/' + uid).update({text})
    promise
    .then((data) => {
      dispatch(actionSuccess(types.TIME_ENTRY_INPUT__CHANGE_TEXT, {payload: {
        text
      }}))
    })
    .catch(() => {
      dispatch(actionFailed(types.TIME_ENTRY_INPUT__CHANGE_TEXT))  
    })

    return promise
  }
}

export const changeStartTime = (uid, date) => {
  return function(dispatch) {
    dispatch(actionStart(types.TIME_ENTRY_INPUT__CHANGE_START_TIME, {'payload': {
      startTime: date
    }}))

    const promise = firebase.database().ref('timeEntryInputs/' + uid).update({startTime: date.getTime()})
    promise
    .then((data) => {
      dispatch(actionSuccess(types.TIME_ENTRY_INPUT__CHANGE_START_TIME, {payload: {
        startTime: date
      }}))
    })
    .catch(() => {
      dispatch(actionFailed(types.TIME_ENTRY_INPUT__CHANGE_START_TIME))  
    })

    return promise
  }
}

export const stop = (uid, text, date, langId) => {
  return function(dispatch) {
    dispatch(actionStart(types.TIME_ENTRY_INPUT__STOP))

    //create complete time entry
    const newEntryRef = firebase.database().ref('timeEntries/' + uid).push()
    const now = new Date()
    const newEntryPromise = newEntryRef.set({
      text: text,
      startTime: date,
      endTime: now.getTime(),
      lang: langId
    })
    
    //delete current tracking entry
    newEntryPromise.then(function(){
      const deleteEntryPromise = firebase.database().ref('timeEntryInputs/' + uid).remove()
      deleteEntryPromise.then(function(){
        dispatch(actionSuccess(types.TIME_ENTRY_INPUT__STOP))
        dispatch(fetchList(uid))
      })
      .catch(function(){
        dispatch(actionFailed(types.TIME_ENTRY_INPUT__STOP))
      })
    })
    .catch(function(){
      dispatch(actionFailed(types.TIME_ENTRY_INPUT__STOP))
    })
  }
}

//Pull tracking entry from server
export const pull = (uid) => {
  return function(dispatch) {
    dispatch(actionStart(types.TIME_ENTRY_INPUT__PULL))
    
    return new Promise((resolve, reject) => {
      const ref = firebase.database().ref('timeEntryInputs/' + uid)
      ref.once('value', function(snapshot){
        const entry = snapshot.val()
        if (entry) {

          const payload = {
            text: entry.text,
            startTime: entry.startTime
          }
          if (entry.lang) {
            payload.langId = entry.lang
          }

          dispatch(actionSuccess(types.TIME_ENTRY_INPUT__PULL, {payload: payload}))

        } else {
          dispatch(actionSuccess(types.TIME_ENTRY_INPUT__PULL, {payload: null}))
        }
        resolve()
      })
    })
  }
}

export const start = (uid, text, date, langId) => {
  return function(dispatch) {
    dispatch(actionStart(types.TIME_ENTRY_INPUT__START, {payload: {
        text,
        startTime: date,
        langId
      }}))
    
    const entryData = {
      text,
      startTime: date,
    }
    
    if (langId) {
      entryData.lang = langId
    }
    
    const promise = firebase.database().ref('timeEntryInputs/' + uid).set(entryData)
    promise
    .then((data) => {

      if (langId) {
        dispatch(actionSuccess(types.TIME_ENTRY_INPUT__START, {payload: {
          text,
          startTime: date,
          langId
        }}))
      } else {
        dispatch(actionSuccess(types.TIME_ENTRY_INPUT__START, {payload: {
          text,
          startTime: date
        }}))
      }

    })
    .catch(() => {
      dispatch(actionFailed(types.TIME_ENTRY_INPUT__START))  
    })

    return promise    
  }
}

export const remove = (uid) => {
  return function(dispatch) {
    dispatch(actionStart(types.TIME_ENTRY_INPUT__REMOVE))
    
    const promise = firebase.database().ref('timeEntryInputs/' + uid).remove()
    promise.then(function(){
      dispatch(actionSuccess(types.TIME_ENTRY_INPUT__REMOVE))
    })
    .catch(function(){
      dispatch(actionFailed(types.TIME_ENTRY_INPUT__REMOVE))
    })
    return promise    
  }
}