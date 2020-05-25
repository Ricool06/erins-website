import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga'
import rootReducer from './reducers';
import { rootSaga } from './sagas';
import { composeWithDevTools } from 'redux-devtools-extension';

export default function configureStore() {
  const sagaMiddleware = createSagaMiddleware();
  const middleWareEnhancer = applyMiddleware(sagaMiddleware);

  // const composedEnhancers = compose(middleWareEnhancer);

  const store = createStore(rootReducer, composeWithDevTools(middleWareEnhancer));

  sagaMiddleware.run(rootSaga);

  return store;
}
