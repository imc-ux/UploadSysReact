import { popupProxy } from "Helper/popupHelper";
import { THEME_DATA } from "Common/constant/dataSource";
import ThemeThumbnail from "Components/ThemeThumbnail";
import ThemeListItem from "Components/ThemeListItem";
import { useEffect, useState } from "react";
import { getLocalItem, setLocalItem } from "Common/helper/storageHelper";
import { defaultTheme } from "@/util/constants";
import {
  changeTheme,
  getCurrentTheme,
  getCurrentThemeMode,
} from "@/util/themeHelper";

function ThemeSwitchPop() {
  const [selectIndex, setSelectIndex] = useState(0);

  useEffect(() => {
    const themeName = getCurrentTheme();
    // const themeName = getLocalItem("theme");
    const index = THEME_DATA.findIndex(
      (item) => themeName.indexOf(item.themeName) >= 0
    );
    setSelectIndex(index > 0 ? index : 0);
  }, []);

  function onThemeThumbnailClickHandler(item: any, index: number) {
    setSelectIndex(index);
    const themeMode = getCurrentThemeMode();
    const themeName = getCurrentTheme(`${item.themeName}-${themeMode}`);
    changeTheme(themeName);
    // document.body.className = item.colorName;
    // document.documentElement.setAttribute(
    //   "data-bs-theme",
    //   item.colorName || defaultTheme
    // );
    // setLocalItem("theme", item.colorName);
    // document.querySelectorAll("iframe").forEach((ele) => {
    //   const element = ele as any;
    //   element.contentWindow.postMessage(
    //     {
    //       type: "theme-changed",
    //       data: item.colorName,
    //     },
    //     "*"
    //   );
    // });
    // // 用于父元素main页面监听
    // window.parent.postMessage(
    //   {
    //     type: "theme-changed",
    //     data: item.colorName,
    //   },
    //   "*"
    // );
    // setLocalItem("svelte-theme", item.colorName);
  }

  return (
    <div w-full overflow-y-auto>
      <div flex flex-col p-35px justify-between flex-wrap>
        {THEME_DATA.map((item, index) => (
          // <div
          //   flex-none
          //   key={index}
          //   onClick={() => onThemeThumbnailClickHandler(item, index)}
          // >
          //   <ThemeThumbnail selected={selectIndex === index} themeInfo={item} />
          // </div>
          <ThemeListItem
            selected={selectIndex === index}
            themeInfo={item}
            onClick={() => onThemeThumbnailClickHandler(item, index)}
          />
        ))}
      </div>
    </div>
  );
}

const popup = popupProxy(ThemeSwitchPop, {
  width: 640,
  height: 550,
  title: "changeTheme",
});

export const LanguageSwitchPopTranslation = {
  en: {
    changeTheme: "Change Theme",
  },
  cn: {
    changeTheme: "切换主题",
  },
};

export default popup;
