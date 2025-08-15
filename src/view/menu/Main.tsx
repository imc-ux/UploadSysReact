import {
  mainMenuList,
  MenuItemType,
  MenuType,
  subMenuTemplateData,
  SUB_MENU_HEADER_IMG_FLAG,
  SubMenuDataType,
} from "Common/constant/menuConstant";
import { deepCopy, subtract, UserInfo } from "Common/helper";
import {
  setSessionUserInfo,
  getSessionItem,
  StorageType,
  getLocalItem,
} from "Common/helper/storageHelper";
import { useEffect, useMemo, useRef, useState } from "react";
import ThemeSwitchPop from "Common/components/pop/ThemeSwitchPop";
import logoImage from "Static/images/common/ux_logo.gif";
import { addImgEvent } from "Common/helper/eventHelper";
import PopCard from "Components/PopCard";

import { useDispatch, useStore } from "Common/context/CommonContext";
import {
  removeOldScriptAndStyle,
  splitTemplate,
} from "Common/helper/templateHelper";
import TemplateComponent from "react-mustache-template-component";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import resources from "Common/constant/languageResources";
import CustomAlert from "Common/components/CustomAlert";
import { insertUxVersion } from "Common/action/mainActions";
import { MainAlert } from "Common/constant/alertText";
import Modal from "Common/components/Modal";
import { getCookie, setCookie } from "Common/helper/cookieHelper";
import { useNavigate } from "react-router-dom";
import { ThemeMode } from "@/util/constants";
import { changeThemeMode, getCurrentTheme } from "@/util/themeHelper";
import cssfilterConverter from "css-filter-converter";

const GREETING_TEXT = "";

export default function Main() {
  const [currentSelectIndex, setCurrentSelectIndex] = useState(0);
  const [showSubMenuIndex, setShowSubMenuIndex] = useState(-10);
  const [subMenuTemplateList, setSubMenuTemplateList] = useState([]);
  const [showLanguageCard, setShowLanguageCard] = useState(false);
  const [currentLang, setCurrentLang] = useState("cn");
  const [showCompactMenu, setShowCompactMenu] = useState(false);
  const [themeMode, setThemeMode] = useState("");
  const [primaryColor, setPrimaryColor] = useState("");

  const { t, i18n } = useTranslation();

  const lastIndexRef = useRef(0);
  const subMenuDelayFlag = useRef(true);
  const subMenusRef = useRef(null);
  // const lastMainContentIframeSrcRef = useRef(getFrameSrc());
  const mainContentIframeRef = useRef(null);
  const subMenuLoadCompleteCount = useRef(0);
  const tempTemplateListRef = useRef(null);
  const templateDataListRef = useRef([]);
  const subMenuIsClickRef = useRef(false);
  const currentSelectIndexRef = useRef(0);

  const store = useStore();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userName: string = useMemo(() => UserInfo.userName, []);
  const templateContent = useMemo(() => {
    if (subMenuTemplateList.length > 0) {
      return mainMenuList.map((item) => renderSubMenuTemplate(item));
    } else {
      return [];
    }
  }, [subMenuTemplateList]);

  useEffect(() => {
    if (!getSessionItem(StorageType.UserName)) {
      navigate("/");
    }
    const primaryColor = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--iux-primary-bg");
    setPrimaryColor(cssfilterConverter.hexToFilter(primaryColor).color);
    window.addEventListener("message", themeChangeHandler, false);
    initialThemeMode();
    initialIframeSrc();
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
    if (!store.allMenuTemplateList) {
      return;
    }
    if (store.allMenuTemplateList.error) {
      CustomAlert(MainAlert.GET_TEMPLATE_FAILED);
      return;
    }
    const returnData = Array.isArray(store.allMenuTemplateList.data)
      ? store.allMenuTemplateList.data
      : [];
    tempTemplateListRef.current = returnData;
    checkSubMenuResourceLoadComplete();
  }, [store.allMenuTemplateList]);

  useEffect(() => {
    if (!store.getValidateNoticeResult) {
      return;
    }
    if (store.getValidateNoticeResult.error) {
      CustomAlert(MainAlert.GET_TEMPLATE_RESOURCES_FAILED);
      return;
    }
    const returnData = Array.isArray(store.getValidateNoticeResult.data)
      ? store.getValidateNoticeResult.data
      : [];
    consistTemplateData(returnData);
  }, [store.getValidateNoticeResult]);

  useEffect(() => {
    if (subMenuTemplateList.length > 0) {
      removeOldScriptAndStyle();
      subMenuTemplateList.forEach((item) => {
        splitTemplate(item.template);
      });
      addImgEvent();
    }
  }, [subMenuTemplateList]);

  useEffect(() => {
    if (!store.insertUxVersionResult) {
      return;
    }
    if (store.insertUxVersionResult.error) {
      CustomAlert(MainAlert.UPDATE_VERSION_FAILED);
      return;
    }

    CustomAlert(MainAlert.UPDATE_VERSION_SUCCESS);
  }, [store.insertUxVersionResult]);

  function initialThemeMode() {
    const currentTheme = getCurrentTheme();
    if (currentTheme && currentTheme.indexOf(ThemeMode.Light) >= 0) {
      setThemeMode(ThemeMode.Light);
    } else {
      setThemeMode(ThemeMode.Dark);
    }
  }

  function initialIframeSrc() {
    mainContentIframeRef.current.src = getFrameSrc(0);
  }

  function checkSubMenuResourceLoadComplete() {
    subMenuLoadCompleteCount.current++;
    if (subMenuLoadCompleteCount.current === 2) {
      subMenuLoadCompleteCount.current = 0;
      setSubMenuTemplateList(tempTemplateListRef.current);
    }
  }

  function getFrameSrc(currentIndex?: number) {
    const index = currentIndex ?? currentSelectIndex;
    switch (index) {
      case 0:
        return "http://109.14.6.43:6636/cusys/uploadSvelte.html";
      case 1:
        return "http://109.14.6.42:70/jtrac/autologin.html";
      case 2:
        return "http://109.14.6.43:6636/cusys/userMgmtMain.html#";
      default:
        break;
    }
  }

  function consistTemplateData(subMenResources: any[]) {
    templateDataListRef.current = deepCopy(subMenuTemplateData);
    templateDataListRef.current.forEach((item: SubMenuDataType) => {
      let currentMenuResource = subMenResources.filter((ele) => {
        if (ele.type.indexOf(item.type) >= 0) {
          if (ele.type.indexOf(SUB_MENU_HEADER_IMG_FLAG) >= 0) {
            item.headImg = ele.content;
            return false;
          } else {
            return true;
          }
        }
      });
      currentMenuResource = currentMenuResource.map((ele) => ({
        type: ele.type,
        showHtml: true,
        content: [{ htmlString: ele.content }],
      }));
      item.children.push(...currentMenuResource);
    });
    checkSubMenuResourceLoadComplete();
  }

  function onMainMenuClickHandler(index: number) {
    lastIndexRef.current = currentSelectIndex;
    mainContentIframeRef.current.src = getFrameSrc(index);
    // lastMainContentIframeSrcRef.current = getFrameSrc(index);
    setCurrentSelectIndex(index);
    setShowSubMenuIndex(-10);
  }

  function onMainMenuMouseEnterHandler(index: number) {
    subMenuDelayFlag.current = computeSubMenuDelayFlag(index);
    setShowSubMenuIndex(index);
  }

  function onMainMenuMouseLeaveHandler() {
    subMenuDelayFlag.current = computeSubMenuDelayFlag(-10);
    setShowSubMenuIndex(-10);
  }

  function computeSubMenuDelayFlag(index: number) {
    return Math.abs(index - showSubMenuIndex) > 2;
  }

  function onSwitchLanguageBtnClickHandler() {
    setShowLanguageCard(true);
  }

  function onLanguageCardCloseHandler() {
    setShowLanguageCard(false);
  }

  function onSwitchThemeBtnClickHandler() {
    ThemeSwitchPop.open();
  }

  function onLogoutBtnClickHandler() {
    setSessionUserInfo();
    navigate("/");
  }

  function onUserIconClickHandler(e: any) {
    console.log("--->", e.target, "==>", e.currentTarget);
  }

  function getMap() {
    if (!subMenusRef.current) {
      subMenusRef.current = new Map();
    }
    return subMenusRef.current;
  }

  function renderSubMenuTemplate(item: MenuItemType) {
    const template = subMenuTemplateList.find(
      (elem) => elem.type === item.type
    )?.template;
    const data = templateDataListRef.current.find(
      (elem: any) => elem.type === item.type
    );
    switch (item.type) {
      case MenuType.BUSINESS:
        return <TemplateComponent template={template} data={data} />;
      case MenuType.INTERACTION:
        return <TemplateComponent template={template} data={data} />;
      case MenuType.MANAGE:
        return <TemplateComponent template={template} data={data} />;
    }
  }

  function onSubMenuSelectedHandler(index: number) {
    currentSelectIndexRef.current = index;
    subMenuIsClickRef.current = true;
    subMenuDelayFlag.current = computeSubMenuDelayFlag(-10);
  }

  function onSwitchLanguageItemClickHandler(data: string) {
    i18next.changeLanguage(data);
    setCurrentLang(data);
    setShowLanguageCard(false);
  }

  async function onVersionBtnClickHandler() {
    const action = await insertUxVersion();
    dispatch(action);
  }

  function onMenuCollapseBtnClickHandler() {
    setShowCompactMenu(!showCompactMenu);
  }

  function onCompactMainMenuClickHandler(index: number) {
    setCurrentSelectIndex(index);
    setShowSubMenuIndex(index);
    subMenuDelayFlag.current = computeSubMenuDelayFlag(index);
  }

  function onModalClickHandler() {
    subMenuDelayFlag.current = computeSubMenuDelayFlag(-10);
    setShowSubMenuIndex(-10);
  }

  function onSwitchThemeModeBtnClickHandler() {
    if (themeMode === ThemeMode.Light) {
      setThemeMode(ThemeMode.Dark);
      changeThemeMode(ThemeMode.Dark);
    } else {
      setThemeMode(ThemeMode.Light);
      changeThemeMode(ThemeMode.Light);
    }
  }

  function onIframeLoadHandler() {
    closeSubMenu();
  }

  function closeSubMenu() {
    if (subMenuIsClickRef.current) {
      subMenuIsClickRef.current = false;
      setCurrentSelectIndex(currentSelectIndexRef.current);
    }
  }

  return (
    <div flex="~ col" h-screen overflow-hidden min-w-290px>
      <header z-1>
        <nav bg-menu relative className="menu-border">
          <div flex="~ auto" h-70px>
            {/* 小屏打开收起按钮 */}
            <div
              justify-end
              items-center
              m-20px
              menu-text
              className="<md:flex md:hidden">
              <div icon-box onClick={onMenuCollapseBtnClickHandler}>
                {showCompactMenu ? (
                  <span className="i-mdi-close" text-2xl />
                ) : (
                  <span className="i-mdi-menu" text-2xl />
                )}
              </div>
            </div>
            {/* 大屏logo */}
            <div flex-none w-117px className="<lg:hidden">
              <img
                id="uploadMenulogo"
                w-full
                src={logoImage}
                style={{
                  filter: primaryColor,
                }}
              />
            </div>
            {/* 大屏主菜单 */}
            <menu flex="~ auto" m-0 className="<md:hidden">
              {mainMenuList.map((item, index) => (
                <li
                  key={index}
                  className="top-menu-item"
                  flex
                  items-center
                  list-none
                  relative
                  cursor-pointer
                  overflow-visible
                  onMouseEnter={() => onMainMenuMouseEnterHandler(index)}
                  onMouseLeave={onMainMenuMouseLeaveHandler}>
                  <div
                    menu-text
                    font-bold
                    h-full
                    flex
                    items-center
                    mr-20px
                    ml-20px
                    relative
                    bg={index === currentSelectIndex ? "active" : ""}
                    after={
                      "content-empty absolute bottom-0 w-full h-5px bg-bottom-line duration-200" +
                      (index !== lastIndexRef.current &&
                      index !== currentSelectIndex
                        ? " -z-1"
                        : "") +
                      (index !== currentSelectIndex
                        ? subtract(index, currentSelectIndex)
                          ? " -translate-x-full opacity-0"
                          : " translate-x-full opacity-0"
                        : "")
                    }
                    onClick={() => onMainMenuClickHandler(index)}>
                    <span
                      relative
                      data-title={t(item.type)}
                      block
                      mr-10px
                      ml-10px
                      transition-all
                      duration-400
                      ease-linear
                      pointer-events-none
                      preserve-3d
                      text-4
                      after="content-[attr(data-title)] absolute left-0 origin-center-top preserve-3d translate-y-full -rotate-x-90">
                      {t(item.type)}
                    </span>
                  </div>
                </li>
              ))}
            </menu>
            {/* 大屏右侧功能按钮 */}
            <div flex="~ auto" justify-end items-center m-20px menu-text>
              <div className="<md:hidden md:flex">
                {/* 版本 */}
                {/* 主题 */}
                <div icon-box onClick={onSwitchThemeBtnClickHandler}>
                  <span className="i-mdi-palette" text-2xl />
                </div>
                <div icon-box onClick={onSwitchThemeModeBtnClickHandler}>
                  {themeMode === ThemeMode.Light ? (
                    <span className="i-mdi-moon-waning-crescent" text-2xl />
                  ) : (
                    <span className="i-mdi-white-balance-sunny" text-2xl />
                  )}
                </div>
                {/* 国际化 */}
                <PopCard
                  open={showLanguageCard}
                  onClose={onLanguageCardCloseHandler}
                  content={
                    <div
                      className="icon-box"
                      onClick={onSwitchLanguageBtnClickHandler}>
                      <span className="i-mdi-translate text-2xl" />
                    </div>
                  }>
                  <SwitchLanguageContent
                    onClick={onSwitchLanguageItemClickHandler}
                  />
                </PopCard>
              </div>

              {/* 用户名 */}
              <div flex-center mr-10px ml-15px onClick={onUserIconClickHandler}>
                <span className="i-mdi-account" text-2xl />
                {GREETING_TEXT} {userName}
              </div>
              {/* 退出 */}
              <div icon-box onClick={onLogoutBtnClickHandler}>
                <span className="i-mdi-location-exit" text-2xl />
              </div>
            </div>
          </div>
          {/* 小屏 */}
          {showCompactMenu && (
            <menu m-0 p-0 relative className="md:hidden">
              {/* 小屏功能按钮 */}
              <div
                menu-text
                mr-20px
                ml-20px
                mb-10px
                className="<md:flex md:hidden">
                {/* 版本 */}
                {/* 主题 */}
                <div icon-box onClick={onSwitchThemeBtnClickHandler}>
                  <span className="i-mdi-palette" text-2xl />
                </div>
                <div icon-box onClick={onSwitchThemeModeBtnClickHandler}>
                  {themeMode === ThemeMode.Light ? (
                    <span className="i-mdi-moon-waning-crescent" text-2xl />
                  ) : (
                    <span className="i-mdi-white-balance-sunny" text-2xl />
                  )}
                </div>
                {/* 国际化 */}
                <PopCard
                  open={showLanguageCard}
                  onClose={onLanguageCardCloseHandler}
                  content={
                    <div
                      className="icon-box"
                      onClick={onSwitchLanguageBtnClickHandler}>
                      <span className="i-mdi-translate text-2xl" />
                    </div>
                  }>
                  <SwitchLanguageContent
                    onClick={onSwitchLanguageItemClickHandler}
                  />
                </PopCard>
              </div>
              {/* 小屏主菜单 */}
              {mainMenuList.map((item, index) => (
                <li
                  key={index}
                  flex
                  items-center
                  list-none
                  cursor-pointer
                  overflow-visible
                  h-10>
                  <a
                    menu-text
                    font-bold
                    h-full
                    w-full
                    flex
                    items-center
                    mr-20px
                    ml-20px
                    relative
                    bg={index === currentSelectIndex ? "active" : ""}
                    onClick={() => onCompactMainMenuClickHandler(index)}>
                    <span
                      relative
                      data-title={t(item.type)}
                      block
                      mr-10px
                      ml-10px>
                      {t(item.type)}
                    </span>
                  </a>
                </li>
              ))}
            </menu>
          )}
          {/* 子菜单 大屏小屏共用*/}
          <div id="topMenu">
            {mainMenuList.map((item, index) => (
              <div
                // ref={(node) => {
                //   const map = getMap();
                //   if (node) {
                //     map.set(index, node);
                //   } else {
                //     map.delete(index);
                //   }
                // }}
                key={index}
                w-screen
                bg-white
                absolute
                top-full
                border-black
                border-1
                overflow-hidden
                className={
                  "-z-1 submenu-border" +
                  (subMenuDelayFlag.current ? " duration-500" : "") +
                  (index === showSubMenuIndex
                    ? " shadow-md"
                    : " -translate-y-full")
                }
                onClick={() => onSubMenuSelectedHandler(index)}
                onMouseEnter={() => onMainMenuMouseEnterHandler(index)}
                onMouseLeave={onMainMenuMouseLeaveHandler}>
                {templateContent[index]}
                {/* {renderSubMenuTemplate(item)} */}
              </div>
            ))}
          </div>
          {/* 显示子菜单时的遮罩 */}
          {showSubMenuIndex >= 0 && (
            <Modal
              zIndex={-2}
              darkModal={false}
              onClick={onModalClickHandler}
            />
          )}
        </nav>
      </header>
      <main flex flex-1>
        <div flex flex-1>
          <iframe
            name="mainContent"
            ref={mainContentIframeRef}
            id="uploadSysMainContent"
            w-full
            h-full
            frameBorder={0}
            onLoad={onIframeLoadHandler}
            // src={lastMainContentIframeSrcRef.current}
          />
        </div>
      </main>
    </div>
  );
}

function SwitchLanguageContent(props: any) {
  const [selectLangIndex, setSelectLangIndex] = useState(
    getLanguageIndex(getCookie("lang"))
  );

  const languageList = useMemo(() => getItemList(), []);

  function onLanguageItemClick(data: string) {
    setSelectLangIndex(getLanguageIndex(data));
    props.onClick(data);
    setCookie("lang", data, 30);
  }

  function getLanguageIndex(langCode: string): number {
    const index =
      languageList?.findIndex((item) => item.code === langCode) ?? 1;
    return index >= 0 ? index : 1;
  }

  function getItemList() {
    const languageList = [];
    for (const key in resources) {
      languageList.push(resources[key]);
    }
    return languageList;
  }

  return (
    <div className="flex">
      <ul flex="~ col" className="p-2 m-0">
        {languageList.map((item: any, index) => (
          <li
            key={item.code}
            className={
              "list-none rounded-md p-3 whitespace-nowrap lang-color leading-30px cursor-pointer hover:lang-hover-bg" +
              (selectLangIndex === index ? " lang-active-bg" : "")
            }
            onClick={() => onLanguageItemClick(item.code)}>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
