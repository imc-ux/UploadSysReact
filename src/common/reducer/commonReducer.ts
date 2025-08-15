import {
  MenuManagerKey,
  MNoticeManagerKey,
  UserManagerKey,
  verifyUserKey,
} from "Service/index";

export const initialState = {
  userListResult: null as any,
  loginResult: null as any,
  allMenuTemplateList: null as any,
  insertUxVersionResult: null as any,
  getValidateNoticeResult: null as any,
};

type CommonState = typeof initialState;

export function commonReducer(state: CommonState, action: any): CommonState {
  switch (action?.type) {
    case UserManagerKey.GetUserList: {
      return {
        ...state,
        userListResult: action.respond,
      };
    }
    case verifyUserKey.VerifyUser: {
      return {
        ...state,
        loginResult: action.respond,
      };
    }
    case MenuManagerKey.GetValidateMenuTemplate: {
      return {
        ...state,
        allMenuTemplateList: action.respond,
      };
    }
    case UserManagerKey.InsertUxVersion: {
      return {
        ...state,
        insertUxVersionResult: action.respond,
      };
    }
    case MNoticeManagerKey.GetValidateNotice: {
      return {
        ...state,
        getValidateNoticeResult: action.respond,
      };
    }
    default:
      return state;
  }
}
