import {
  mainMenuList,
  MenuItemType,
  navOtherItemTranslation,
} from "Common/constant/menuConstant";
import { LanguageSwitchPopTranslation } from "Components/pop/ThemeSwitchPop";

function getMenuListTranslationObject(lang: string) {
  const translationObj: any = {};
  mainMenuList.forEach((item) => {
    translationObj[item.type] = getMenuName(item, lang);
  });
  return translationObj;
}

function getMenuName(menuItem: MenuItemType, lang: string) {
  switch (lang) {
    case "cn":
      return menuItem.nameCN;
    case "en":
      return menuItem.nameEN;
    default:
      break;
  }
}

const resources: any = {
  en: {
    name: "English",
    code: "en",
    translation: {
      ...getMenuListTranslationObject("en"),
      ...navOtherItemTranslation.en,
      ...LanguageSwitchPopTranslation.en,
    },
  },
  cn: {
    name: "中文(简体)",
    code: "cn",
    translation: {
      ...getMenuListTranslationObject("cn"),
      ...navOtherItemTranslation.cn,
      ...LanguageSwitchPopTranslation.cn,
    },
  },
};

export default resources;
