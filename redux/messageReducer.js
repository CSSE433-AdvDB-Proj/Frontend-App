const initialState = {
  messages: {},
};

const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case "RECEIVED_MESSAGE":
      let messages =
        state.messages[action.from] == null ? [] : state.messages[action.from];
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.from]: [...messages, action.payload],
        },
      };
    default:
      return state;
  }
};

export default messageReducer;
