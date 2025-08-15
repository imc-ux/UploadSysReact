import { getLocalItem, setLocalItem } from "@/common/helper/storageHelper";
import { defaultTheme, ThemeMode } from "./constants";

const themeModeReg = /dark|light/;

export function getCurrentTheme(themeName?: string) {
  return themeName || getLocalItem("theme") || defaultTheme;
}

export function getCurrentThemeMode() {
  const currentTheme = getCurrentTheme();
  if (themeModeReg.test(currentTheme)) {
    return currentTheme.match(themeModeReg)[0];
  } else {
    return ThemeMode.Dark;
  }
}

export function changeThemeMode(themeMode: ThemeMode) {
  const currentTheme = getCurrentTheme();
  const themeName = currentTheme.replace(/dark|light/, themeMode);
  changeTheme(themeName);
}

export function changeTheme(themeName: string) {
  // 现在的主题，添加data-bs-theme属性
  setThemeAttribute(themeName);
  postThemeChangeMessage(themeName);
}

export function setThemeAttribute(themeName: string) {
  document.documentElement.setAttribute("data-bs-theme", themeName);
  // 菜单的主题，给body添加class
  document.body.className = removeThemeMode(themeName);
  setLocalItem("theme", themeName);
  // svelte使用
  setLocalItem("svelte-theme", themeName);
}

function postThemeChangeMessage(themeName: string) {
  document.querySelectorAll("iframe").forEach((ele) => {
    const element = ele as any;
    element.contentWindow.postMessage(
      {
        type: "theme-changed",
        data: themeName,
      },
      "*"
    );
  });
  // 用于父元素main页面监听
  window.parent.postMessage(
    {
      type: "theme-changed",
      data: themeName,
    },
    "*"
  );
}

// 临时使用
function removeThemeMode(themeName: string) {
  if (themeName !== defaultTheme) {
    const temp = themeName.replace(themeModeReg, "");
    const newThemeName = temp.substring(0, temp.length - 1);
    return newThemeName;
  }
  return themeName;
}
