import dotProp from 'dot-prop';
import { get } from 'lodash';
import produce from 'immer';
import reducerHelper from './internal/helpers/reducer';
import {
  BEFORE_DISPATCH,
  DO_SUBMIT,
  HOC_CLEAR,
  REDUX_SET,
  REDUX_SET_FN,
  SUBMIT_ACKED,
  SUBMIT_FAILED,
  SUBMIT_SUCCEED,
  VARIABLES,
} from './internal/constants';
import helpers from './internal/helpers';

// The initial state of the App
const initialState = {};
/* eslint-disable default-case, no-param-reassign */
export const updateValue = (draftState, keyPath, value) => {
  try {
    const [key, ...rest] = keyPath;
    if (rest.length) {
      const values = draftState[key] || {};
      const kp = reducerHelper.keyPathToStringPath(rest);
      dotProp.set(values, kp, value);
    } else {
      draftState[key] = value;
    }
  } catch (error) {
    console.log(error);
  }
};

const getValue = (draftState, keyPath) => {
  const [name, key, ...rest] = keyPath;
  let currentValue;

  // immutable
  if (helpers.config.isResagaStore(name)) {
    const kp = reducerHelper.keyPathToStringPath(key);
    currentValue = dotProp.get(draftState, `${VARIABLES}.${kp}`);
  } else {
    currentValue = draftState[key];
  }
  // non-immutable
  if (rest.length && typeof currentValue === 'object') {
    currentValue = get(currentValue, rest);
  }
  return currentValue;
};

const getValues = (state, keyPath) => {
  const currentValue = getValue(state, keyPath);
  return [currentValue];
};

const setValue = (draftStore, { keyPath, value }) => {
  const [name, ...rest] = keyPath;
  // could be pageStore, could be under VARIABLES
  if (helpers.config.isResagaStore(name)) {
    const kp = reducerHelper.keyPathToStringPath(rest);
    dotProp.set(draftStore, `${VARIABLES}.${kp}`, value);
  } else {
    // upsert value from rest path
    updateValue(draftStore, rest, value);
  }

  // // set updated value to store.VARIABLES
  // if (helpers.config.isResagaStore(name)) {
  //   return pageStore.merge({
  //     [VARIABLES]: newValue,
  //   });
  // }
  //
  // // set updated value directly to store
  // return pageStore.merge(newValue);
};

const setValueWithFunction = (state, { keyPath, func }) => {
  const currentValues = getValues(state, keyPath);
  return setValue(state, { keyPath, value: func(...currentValues) });
};

/**
 * we store different forms in a page separately, distinguish by their `requestName`
 * and each form will have their own error and success status
 * @param state
 * @param action
 * @returns {any}
 */
/* eslint-disable default-case, no-param-reassign */
export const reducers = (state = initialState, action) => {
  const trimmedType = helpers.reducer.trim(action.type);
  return produce(state, draft => {
    switch (trimmedType) {
      case BEFORE_DISPATCH:
        draft[action.requestName] = {
          name: action.name,
          requestName: action.requestName,
          payload: action.payload,
          options: action.options,
          willLoad: true,
        };
        break;

      case DO_SUBMIT:
        draft[action.requestName] = {
          isLoading: true,
        };
        break;

      case SUBMIT_FAILED:
        draft[action.requestName] = {
          name: action.name,
          requestName: action.requestName,
          payload: action.payload,
          options: action.options,
          error: action.error,
        };
        break;

      case SUBMIT_SUCCEED:
        draft[action.requestName] = {
          name: action.name,
          requestName: action.requestName,
          payload: action.payload,
          options: action.options,
          result: action.result,
          isSuccess: true,
        };
        break;

      case SUBMIT_ACKED:
        draft[action.requestName] = null;
        break;

      case HOC_CLEAR:
        draft = initialState;
        break;

      case REDUX_SET:
        setValue(draft, action);
        break;

      case REDUX_SET_FN:
        setValueWithFunction(draft, action);
        break;
    }
  });
};

const reducer = (name, customs) =>
  helpers.reducer.wrapReducer(reducers, name, customs);

export default reducer;
