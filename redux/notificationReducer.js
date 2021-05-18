const initialState = {
  notifications: [],
};

/*
type: "RECEIVED_NOTIFICATION",
from: from,
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
      return v.header == "MESSAGE" && v.from == action.from;
    });

    if (notification == undefined) {
      notifications.push({
        from: action.from,
        header: action.header,
        timestamp: action.timestamp,
        isGroupChat: action.isGroupChat,
        payload: action.payload,
        count: 1,
      });
    } else {
      notification.timestamp = action.timestamp;
      notification.count += 1;
    }
  } else {
    notifications.push({
      from: action.from,
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
