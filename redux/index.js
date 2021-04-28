import { createStore, combineReducers, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";

import demoReducer from "./demoReducer";
import testChatReducer from "./testChatReducer";
import liveDemoReducer from "./liveDemoReducer";
import authReducer from "./authReducer"

const middleware = [reduxThunk];
const getStore = (preloadState, options) => {
  return createStore(
    combineReducers({
      demoReducer,
      testChatReducer,
      liveDemoReducer,
      authReducer,
    }),
    applyMiddleware(...middleware)
  );
};

export default getStore;
