import { VARIABLES } from './constants';

const selectPage = page => state => {
  const store = state[page];
  if (!store) return undefined;
  const { [VARIABLES]: vari, ...rest } = store;
  return rest;
};

export default {
  selectPage,
};
