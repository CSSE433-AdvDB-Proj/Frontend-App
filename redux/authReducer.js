const initialState = {
  token: null,
  user: "{}",
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_TOKEN":
      // console.log("asd");
      return { ...state, token: action.value };
    case "SET_USER":
      return { ...state, user: JSON.stringify(action.payload) };
    default:
      return state;
  }
};

export default authReducer;
