const initialState = {
  messages: {},
  fetching: {},
};

const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
    case "LOGOUT":
      return { ...initialState };
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
    case "PULL_UNREAD":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default messageReducer;
