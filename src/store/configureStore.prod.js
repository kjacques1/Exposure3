import thunkMiddleware from 'redux-thunk'
import support from '../support'
import {createStore, applyMiddleware} from 'redux'


const configureStore = () => {
  const store = createStore(
    support, 
    {},
    applyMiddleware(
      thunkMiddleware
    )
  )
  return store
}

export default configureStore
