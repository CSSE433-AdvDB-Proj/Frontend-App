const initialState = {
  users: {},
  groups: {},
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOAD_USER":
      return {
        ...state,
        users: {
          ...state.users,
          [action.username]: action.name,
        },
      };
    case "LOAD_GROUP":
      return {
        ...state,
        groups: {
          ...state.groups,
          [action.groupid]: action.name,
        },
      };
    default:
      return state;
  }
};

export default profileReducer;
