import axios from "axios";

const TO_FETCH = 5;

const initialState = {
  messages: {},
  fetching: {},
  timestamps: {},
};

const messageReducer = (state = initialState, action) => {
  let messages;
  let timestamp;
  switch (action.type) {
    case "LOGIN":
    case "LOGOUT":
      return { ...initialState };
    case "FETCH_MESSAGES":
      messages =
        state.messages[action.chat] == null ? [] : state.messages[action.chat];
      return {
        ...state,
        timestamps: {
          ...state.timestamps,
          [action.chat]: action.timestamp,
        },
        messages: {
          ...state.messages,
          [action.chat]: [...action.messages, ...messages],
        },
      };
    case "RECEIVED_MESSAGE":
      messages =
        state.messages[action.chat] == null ? [] : state.messages[action.chat];
      timestamp = state.timestamps[action.chat];
      if (action.timestamp < timestamp) {
        timestamp = action.payload.timestamp;
      }
      return {
        ...state,
        timestamps: {
          ...state.timestamps,
          [action.chat]: action.payload.timestamp,
        },
        messages: {
          ...state.messages,
          [action.chat]: [...messages, action.payload],
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

export const getMessageHistory = (from, token, lastTimestamp) => {
  return (dispatch) => {
    axios
      .get("http://localhost:8080/blackboard/message/history_message", {
        params: { messageCount: TO_FETCH, from, fromTimestamp: lastTimestamp },
        headers: {
          "Blackboard-Token": token,
        },
      })
      .then((res) => {
        if (res.data.code != 0) {
          throw res.data.msg;
        }
        if (res.data.data.length == 0) {
          throw "No messages";
        }
        let timestamp = res.data.data[res.data.data.length - 1].timestamp;
        dispatch({
          type: "FETCH_MESSAGES",
          chat: from,
          timestamp,
          messages: res.data.data.reverse().map((item) => {
            return { ...item, chatId: item.from };
          }),
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
