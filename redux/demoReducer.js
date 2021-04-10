const initialState = {
  0: "zero",
  1: "one",
  2: "two",
  3: "",
};

const demoReducer = (state = initialState, action) => {
  switch (action.type) {
    case "test":
      return { ...state, 3: "three" };
    default:
      return state;
  }
};

export default demoReducer;
