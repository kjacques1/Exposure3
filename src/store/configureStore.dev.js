import thunkMiddleware from 'redux-thunk'
import support from '../support'
import {createStore, applyMiddleware} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

const configureStore = () => {
  const store = createStore(
    support, 
    {},
    composeWithDevTools(
      applyMiddleware(thunkMiddleware)
    )
  )
  return store
}

export default configureStore
