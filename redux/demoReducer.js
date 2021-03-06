const initialState = {
  0: "zero",
  1: "one",
  2: "two",
  3: "",
  curNum: {
    hello: "world",
    value: 0,
  },
};

const demoReducer = (state = initialState, action) => {
  switch (action.type) {
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

export const changeCurNum = (newNum, send) => {
  return (dispatch) => {
    const payload = { type: "DEMO_SET_CURNUM", newNum };
    if (send) {
      send(JSON.stringify(payload));
    }
    dispatch(payload);
  };
};
