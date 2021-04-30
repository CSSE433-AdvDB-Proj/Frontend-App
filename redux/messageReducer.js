const initialState = {
  messages: {},
};

const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case "RECEIVED_MESSAGE":
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.from]: action.payload,
        },
      };
    default:
      return state;
  }
};

export default messageReducer;
