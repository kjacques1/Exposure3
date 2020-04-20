import firebase from '../DatabaseConnection'
import * as types from '../Solide'
import {actionStart, actionSuccess} from './screener'

// Fetch report data
export const fetch = (uid, text, startDate, endDate) => {
  return function(dispatch) {
    dispatch(actionStart(types.REPORT_FETCH, {payload: {
      startDate,
      endDate
    }}))

    const ref = firebase.database().ref('timeEntries/' + uid)
      .orderByChild('startTime')
        .startAt(startDate)
        .endAt(endDate)

    return new Promise(function(resolve, reject){      
      ref.once('value', function(snapshot){

        const dispatchActionSuccess = (entries) => {
          dispatch(actionSuccess(types.REPORT_FETCH, {payload: {
            entries,
            startDate,
            endDate
          }}))
          resolve()          
        }

        let entries = snapshot.val()
        if (!entries) {
          dispatchActionSuccess([])
        }

        let filteredEntries = {}

        for (let key in entries) {
          if (entries.hasOwnProperty(key)) {
            //filter text on clientside
            if (text) {
              if (entries[key].text.indexOf(text) !== -1) {
                filteredEntries[key] = entries[key]
              }            
            }
          }
        }

        if (text) {
          entries = filteredEntries
        }

        if (!entries) {
          dispatchActionSuccess([])
        }
        
        //add tag detail for entry
        let langPromises = []
        Object.keys(entries).forEach(key => {
          let entry = entries[key]
          if (entry.lang) {
            const promise = firebase.database().ref('langs/' + uid + '/' + entry.lang).once('value', snapshot => {
              entry.langName = snapshot.val().name
              entry.langColor = snapshot.val().color
            })
            langPromises.push(promise)
          }
        })
        
        Promise.all(langPromises).then(() => {
          dispatchActionSuccess(entries)
        })

      })
    })
  }
}