const initialState = {
  reducerContent: "Initialized.",
};

const liveDemoReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHANGE_LIVE_DEMO":
      return {
        ...state,
        reducerContent: action.newContent,
      };
    default:
      return state;
  }
};

export default liveDemoReducer;

export const changeReducerContent = (newContent) => {
  return (dispatch) => {
    dispatch({ type: "CHANGE_LIVE_DEMO", newContent });
  };
};
