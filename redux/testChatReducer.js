const initialState = {
  messages: [],
};

const testChatReducer = (state = initialState, action) => {
  switch (action.type) {
    case "test":
      return { ...state, 3: "three" };
    case "TEST_CHAT_MESSAGE":
      // makes a copy of messages, adds a new item, and sends it out
      console.log("Dispatched message.");
      return {
        ...state,
        messages: [...state.messages, JSON.stringify(action)],
      };
    default:
      return state;
  }
};

export default testChatReducer;

export const sendMessage = (content, client) => {
  return (dispatch) => {
    const payload = {
      type: "TEST_CHAT_MESSAGE",
      sender: "You",
      timestamp: "" + Date.now(),
      content,
    };
    if (client) {
      client.send(JSON.stringify(payload));
    }
    dispatch(payload);
  };
};
