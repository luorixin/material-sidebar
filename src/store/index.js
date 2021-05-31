import { createStore, applyMiddleware } from 'redux';

import reducer from '../reducer/index';
import sagas from '../saga/index';
import sagaMiddleware from './saga';

// Store
const store = createStore(
    reducer,
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(sagas);

export default store;