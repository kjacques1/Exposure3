import * as types from '../Solide'

const langs = (state = {}, action) => {
  switch (action.type) {
    case types.LANGS_FETCH_LIST:
      if (action.isFetching && action.isFetching === true) {
        return {
          langs: [],
          isFetching: true
        }
      }

      if (action.status && action.status === 'success') {
        return { 
          langs: action.payload,
          isFetching: false
        }
      }

      return state

    default :
      return state
  }
}

export default langs