/* eslint-disable no-underscore-dangle */
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

export default function configureStore(reducer, initialState) {
  let composeEnhancers = compose;
  if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) { composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}); }
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware];
  const enhancers = [applyMiddleware(...middlewares)];
  const store = createStore(
    combineReducers(reducer),
    initialState,
    composeEnhancers(...enhancers),
  );
  store.runSaga = sagaMiddleware.run;
  store.injectedReducers = {}; // Reducer registry
  store.injectedSagas = {};
  return {
    store,
    runSaga: store.runSaga,
  };
}
