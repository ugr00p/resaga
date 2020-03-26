import createCachedSelector from 're-reselect';
import { SEPARATOR, VARIABLES } from '../constants';

export const selectValues = name => state => state && state[name][VARIABLES];

export const shallowlyConvert = values => values || null;

const selectOwnStore = configs =>
  createCachedSelector(selectValues(configs.name), shallowlyConvert)(
    () => `${configs.name}${SEPARATOR}${VARIABLES}`,
  );

export default selectOwnStore;
