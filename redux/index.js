import { createStore, combineReducers } from "redux";
import demoReducer from "./demoReducer";

const getStore = (preloadState, options) => {
  return createStore(
    combineReducers({
      demoReducer,
    }),
    preloadState
  );
};

export default getStore;
