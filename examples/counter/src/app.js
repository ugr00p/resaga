import 'babel-polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './utils/configureStore';
import Counter from './Counter';
import resaga, { reducer } from '../../../build';

const PAGE = 'CounterPage';
const PAGE2 = 'CounterPage2';
const store = configureStore({ [PAGE]: reducer(PAGE), [PAGE2]: reducer(PAGE2) });

const WrappedCounter = resaga(Counter, {
  name: PAGE,
});

render(
  <Provider store={store}><WrappedCounter /></Provider>,
  document.getElementById('root')
);
