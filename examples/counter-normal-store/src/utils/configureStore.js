/* eslint-disable no-underscore-dangle */
import { createStore, combineReducers } from 'redux';

export default function configureStore(reducer) {
  return createStore(
    combineReducers(reducer),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
}
