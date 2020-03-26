/* eslint-disable no-underscore-dangle */
import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';

export default function configureStore(reducer) {
  const sagaMiddleware = createSagaMiddleware();
  return {
    ...createStore(
      combineReducers(reducer),
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
      applyMiddleware(sagaMiddleware),
    ),
    runSaga: sagaMiddleware.run,
  };
}
