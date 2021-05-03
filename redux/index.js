import { createStore, combineReducers, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";

import demoReducer from "./demoReducer";
import testChatReducer from "./testChatReducer";
import liveDemoReducer from "./liveDemoReducer";
import authReducer from "./authReducer";
import messageReducer from "./messageReducer";
import notificationReducer from "./notificationReducer";


const middleware = [reduxThunk];
const getStore = (preloadState, options) => {
  return createStore(
    combineReducers({
      demoReducer,
      testChatReducer,
      liveDemoReducer,
      authReducer,
      messageReducer,
      notificationReducer,
    }),
    applyMiddleware(...middleware)
  );
};

export default getStore;
