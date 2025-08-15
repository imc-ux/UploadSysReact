import leaf from "Static/images/common/theme/ux_theme_bg_leaf.png";
import garden from "Static/images/common/theme/ux_theme_bg_garden.png";
import whale from "Static/images/common/theme/ux_theme_bg_whale.png";
import dark from "Static/images/common/theme/ux_theme_bg_dark.png";

export interface ThemeItemInfo {
  color: string;
  themeName: string;
  themeTitle: string;
}

export const THEME_DATA: Array<ThemeItemInfo> = [
  {
    color: "#6750A4",
    themeName: "ux-base",
    themeTitle: "Base",
  },
  {
    color: "#008000",
    themeName: "ux-green",
    themeTitle: "Green",
  },
  {
    color: "#4B0082",
    themeName: "ux-indigo",
    themeTitle: "Indigo",
  },
  {
    color: "#0000FF",
    themeName: "ux-blue",
    themeTitle: "Blue",
  },
  {
    color: "#008080",
    themeName: "ux-teal",
    themeTitle: "Teal",
  },
  {
    color: "#FFFF00",
    themeName: "ux-yellow",
    themeTitle: "Yellow",
  },
  {
    color: "#FFA500",
    themeName: "ux-orange",
    themeTitle: "Orange",
  },
  {
    color: "#DD6E0F",
    themeName: "ux-deepOrange",
    themeTitle: "DeepOrange",
  },
  {
    color: "#FFC0CB",
    themeName: "ux-pink",
    themeTitle: "Pink",
  },
];

// 主题切换   此处需要和H5_Svelte项目中的 style->theme->_var一致
// export const THEME_DATA = [
//   {
//     color: "#08ADAA", // 主题色
//     themeName: "ux-green",
//     girdColor: "#08ADAA", // grid表头背景色
//     girdFontColor: "#FFFFFF", // grid表头内容颜色
//     img: leaf, // 换肤POP背景图
//   },
//   {
//     color: "#379CDC",
//     colorName: "ux-whale",
//     themeName: "ux-whale",
//     girdColor: "#379CDC",
//     girdFontColor: "#FFFFFF", // grid表头内容颜色
//     img: whale,
//   },
//   {
//     color: "#547A14",
//     colorName: "ux-garden",
//     themeName: "ux-garden",
//     girdColor: "#D0E0FA",
//     girdFontColor: "#FFFFFF", // grid表头内容颜色
//     img: garden,
//   },
//   {
//     color: "#505251",
//     themeName: "ux",
//     girdColor: "#505251",
//     girdFontColor: "#a4a4a4", // grid表头内容颜色
//     img: dark,
//   },
// ];
