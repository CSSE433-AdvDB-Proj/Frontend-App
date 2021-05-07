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
    case "LOGIN":
    case "LOGOUT":
      return { ...initialState };
    case "RECEIVED_NOTIFICATION":
      return parseNotification(state, action);
    default:
      return state;
  }
};

const parseNotification = (state, action) => {
  let notifications = [...state.notifications];
  if (action.header == "MESSAGE") {
    let notification = notifications.find((v) => {
      return v.header == "MESSAGE" && v.sender == action.sender;
    });

    if (notification == undefined) {
      notifications.push({
        sender: action.sender,
        header: action.header,
        timestamp: action.timestamp,
        payload: action.payload,
        count: 1,
      });
    } else {
      notification.timestamp = action.timestamp;
      notification.count += 1;
    }
  } else {
    notifications.push({
      sender: action.sender,
      header: action.header,
      timestamp: action.timestamp,
      payload: action.payload,
    });
  }

  notifications.sort((a, b) => {
    return b.timestamp - a.timestamp;
  });

  return {
    ...state,
    notifications,
  };
};

export default notificationReducer;
