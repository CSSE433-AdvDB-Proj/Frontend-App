const initialState = {
  token: null,
  user: {},
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_TOKEN":
      // console.log("asd");
      return { ...state, token: action.value };
    case "SET_USER":
      return { ...state, user: action.payload };
    case "UPDATE_USER":
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
};

export default authReducer;

export const updateAccount = (data) => {
  return (dispatch) => {
    dispatch({ type: "UPDATE_USER", payload: data });
  };
};
