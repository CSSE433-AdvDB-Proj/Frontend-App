const initialState = {
  token: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_TOKEN":
      // console.log("asd");
      return { ...state, token: action.value };
    default:
      return state;
  }
};

export default authReducer;
