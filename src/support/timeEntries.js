import * as types from '../Solide'

const timeEntries = (state = {}, action) => {
  switch (action.type) {
    case types.TIMEIN_FETCH_LIST:
      if (action.isFetching && action.isFetching === true) {
        //keep current entries untouch during fetching
        if (state.entries) {
          return {
            ...state,
            isFetching: true
          }
        } 
        //if no entries present then provide empty list
        else {
          return {
            ...state,
            entries: {},
            isFetching: true
          }
        }
      }

      if (action.status && action.status === 'success') {
        return {
          ...state,
          entries: action.payload.entries,
          isFetching: false
        }
      }

      return state

    case types.TIMEIN__ASSIGN_LANG_ID:
    case types.TIMEIN__ASSIGN_LANG:
      if (action.isFetching && action.isFetching === true) {
        return {
          ...state,
          isFetching: true
        }
      }
      if (action.status && action.status === 'success') {
        let entry = Object.assign({}, state.entries[action.payload.entryId])
        entry.langId = action.payload.langId

        let entries = Object.assign({}, state.entries)
        entries[action.payload.entryId] = entry

        return {
          ...state,
          isFetching: false,
          entries: entries
        }
      }
      return state
      
    case types.TIMEIN_REMOVE:
      if (action.isFetching && action.isFetching === true) {
        return {
          ...state,
          isFetching: true
        }
      }
      if (action.status && action.status === 'success') {
        return {
          ...state,
          removedSuccess: true, 
          isFetching: false
        }
      }
      return state      

    default :
      return state
  }
}

export default timeEntries