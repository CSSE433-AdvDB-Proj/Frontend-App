import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  0: "zero",
  1: "one",
  2: "two",
  3: "",
  curNum: {
    value: 0,
  },
};

const demoReducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE:
      return action.payload.demoReducer;
    case "test":
      return { ...state, 3: "three" };
    case "DEMO_SET_CURNUM":
      return {
        ...state,
        curNum: {
          ...state.curNum,
          value: action.newNum,
        },
      };
    default:
      return state;
  }
};

export default demoReducer;

export const changeCurNum = (newNum) => {
  return (dispatch) => {
    dispatch({ type: "DEMO_SET_CURNUM", newNum: newNum });
  };
};
