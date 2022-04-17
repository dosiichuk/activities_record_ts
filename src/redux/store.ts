import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import trackerReducer from './tracker';

import userEventsReducer from './userEvents';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const rootReducer = combineReducers({
  userEvents: userEventsReducer,
  tracker: trackerReducer,
});

//the state returned from reducer is described as a type returned from the reducer function
export type RootState = ReturnType<typeof rootReducer>;

const store = createStore(
  rootReducer,
  compose(applyMiddleware(thunk), composeEnhancers())
);

export default store;
