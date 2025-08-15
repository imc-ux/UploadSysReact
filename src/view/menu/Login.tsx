import { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useStore } from "Context/CommonContext";
import { getUserList, verifyUser } from "Action/loginActions";
import { UsersInfo } from "Vo/index";
import {
  getSessionItem,
  setSessionUserInfo,
  StorageType,
} from "Common/helper/storageHelper";
import { Md5 } from "ts-md5";
import { getCookie, setCookie } from "Common/helper/cookieHelper";
import UCloud from "Common/helper/UCloudHelper";
//import logoImage from "Static/images/common/ux_logo_login.gif";
import logoImage from "Static/images/common/ux_logo.gif";
import CustomAlert from "Common/components/CustomAlert";
import { LoginAlert } from "Common/constant/alertText";
import { useNavigate } from "react-router-dom";
import cssfilterConverter from "css-filter-converter";

const PSW_PLACEHOLDER = "Password";
const READONLY_USER = "只读用户";

interface loginInfo {
  id?: string;
  password?: string;
}

export default function Login() {
  const [userList, setUserList] = useState([]);
  const [userSelectValue, setUserSelectValue] = useState("");
  const [password, setPassword] = useState("");
  const [rememberChecked, setRememberChecked] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("");

  const store = useStore();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    autoLogin();
  }, []);

  useEffect(() => {
    UCloud();
    const param: UsersInfo = {};
    param.blockflag = "N";
    param.usertype = "U";
    param.iPageCount = 20;
    param.iStart = 0;
    dispatchGetUserList(param);
    const primaryColor = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--iux-primary-bg");
    setPrimaryColor(cssfilterConverter.hexToFilter(primaryColor).color);
    window.addEventListener("message", themeChangeHandler, false);
    return () => {
      UCloud(true);
    };
  }, []);

  function themeChangeHandler(e: any) {
    if (e.data.type === "theme-changed") {
      const primaryColor = window
        .getComputedStyle(document.documentElement)
        .getPropertyValue("--iux-primary-bg");
      setPrimaryColor(cssfilterConverter.hexToFilter(primaryColor).color);
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", onKeyDownHandler);
    return () => {
      document.removeEventListener("keydown", onKeyDownHandler);
    };
  }, [userSelectValue, password, rememberChecked]);

  useEffect(() => {
    if (!store.userListResult) {
      return;
    }
    dispatchGetUserList(null);
    if (store.userListResult.error) {
      CustomAlert(LoginAlert.GET_USER_FAILED);
      return;
    }
    const data = Array.isArray(store.userListResult.data)
      ? store.userListResult.data
      : [];
    setUserSelectOptions(data);
  }, [store.userListResult]);

  useEffect(() => {
    if (!store.loginResult) {
      return;
    }
    dispatchLogin(null);
    if (store.loginResult.error) {
      CustomAlert(LoginAlert.LOGIN_FAILED);
      return;
    }
    const result = store.loginResult.data;
    afterLoginSuccess(result);
  }, [store.loginResult]);

  function onKeyDownHandler(event: any) {
    if (event.keyCode === 13) {
      onLoginBtnClickHandler();
    }
  }

  function autoLogin() {
    if (getSessionItem(StorageType.UserName)) {
      navigate("/menu");
    }
  }

  function setUserSelectOptions(data: any[]) {
    if (data.length > 0) {
      const user = {
        nid: "999",
        blockFlag: "",
        id: "",
        name: "游客",
        password: "",
        permissionGroup: "",
        userType: "",
      };
      data.unshift(user);
    }
    setUserList(data);
    const rememberUserId = getCookie("userId") ?? "";
    if (rememberUserId) {
      setUserSelectValue(rememberUserId);
    }
  }

  async function dispatchGetUserList(param: any) {
    const action = await getUserList(param);
    dispatch(action);
  }

  function onUserSelectChangeHandler(e: any) {
    setUserSelectValue(e.target.value);
  }

  function onPasswordInputBlurHandler(e: any) {
    setPassword(e.target.value.trim());
  }

  function onRememberCheckboxChangeHandler(e: any) {
    setRememberChecked(e.target.checked);
  }

  function onLoginBtnClickHandler() {
    if (userSelectValue && !password) {
      CustomAlert(LoginAlert.PASSWORD_EMPTY);
      return;
    }
    if (!userSelectValue) {
      const user: UsersInfo = {};
      user.name = READONLY_USER;
      setSessionUserInfo(user);
    } else {
      const request: loginInfo = {};
      request.id = userSelectValue;
      request.password = Md5.hashStr(password.trim()).toLocaleUpperCase();
      dispatchLogin(request);
    }
  }

  async function dispatchLogin(loginData: loginInfo) {
    const action = await verifyUser(loginData);
    dispatch(action);
  }

  function afterLoginSuccess(data: any) {
    setSessionUserInfo(data);
    if (rememberChecked) {
      setCookie("userId", data.id, 30);
      setCookie("UserName", data.name, 30);
      setCookie("permission", data.permission, 30);
    }
    chromeExtensionMessage();
    navigate("/menu");
  }

  function chromeExtensionMessage() {
    const editorExtensionId = window.localStorage.getItem("extensionID");
    if (window.chrome && editorExtensionId) {
      window.chrome.runtime.sendMessage(editorExtensionId, {
        sender: userSelectValue,
        type: "autoLogin",
      });
    }
  }

  return (
    <div w-full flex justify-center items-center h-screen>
      <main
        flex="~ col"
        justify-center
        items-center
        border-1
        border="~ solid gray-500"
        rounded-md
        pt-12
        px-8
        pb-16
        min-w-384px
        basis-464px
        flex-shrink
        min-h-512px
        bg-white>
        <div mb-12 flex items-center>
          <img
            src={logoImage}
            width={131}
            height={80}
            style={{
              filter: primaryColor,
            }}
          />
        </div>
        <div
          flex
          w-full
          items-center
          mb-4
          relative
          after="content-empty absolute right-5px border-solid border-5 border-transparent border-t-black translate-y-1/4">
          <select
            min-w-100px
            login-input
            className="focus:border-focus"
            appearance-none
            relative
            value={userSelectValue}
            onChange={onUserSelectChangeHandler}>
            {userList.map((userItem, index) => (
              <option key={userItem.nid ?? index} value={userItem.id}>
                {userItem.name}
              </option>
            ))}
          </select>
        </div>
        <input
          login-input
          className="focus:border-focus"
          focus-border
          min-w-100px
          mb-4
          type="password"
          placeholder={PSW_PLACEHOLDER}
          onChange={onPasswordInputBlurHandler}
        />
        <button
          className="bg-primary hover:bg-btn-active"
          w-full
          min-w-100px
          h-44px
          mt-12
          mb-4
          border-0
          rounded-2px
          text-white
          cursor-pointer
          onClick={onLoginBtnClickHandler}>
          Login
        </button>

        <div flex justify-start w-full>
          <input
            type="checkbox"
            id="rememberme"
            accent-primary
            checked={rememberChecked}
            onChange={onRememberCheckboxChangeHandler}
          />
          <label htmlFor="rememberme">Remember me</label>
        </div>
      </main>
    </div>
  );
}
