import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const middleWareEnhancer = applyMiddleware(thunk);

const composedEnhancers = compose(middleWareEnhancer);

export const store = createStore(rootReducer, {}, composedEnhancers);