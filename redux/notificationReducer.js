const initialState = {
  notifications: [],
};

/*
type: "RECEIVED_NOTIFICATION",
from: sender,
payload: hook,
header: "MESSAGE",
timestamp
*/

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case "RECEIVED_NOTIFICATION":
      return {
        ...state,
        notifications: [
          {
            sender: action.sender,
            header: action.header,
            timestamp: action.timestamp,
            payload: action.payload,
          },
          ...state.notifications,
        ],
      };
    default:
      return state;
  }
};

export default notificationReducer;
