import { createRoot } from "react-dom/client";
import "uno.css";
import "@/style/main.css";
import "@/style/custom.css";
import "@/style/theme.css";
import { CommonProvider } from "Context/CommonContext";
import { getLocalItem } from "Common/helper/storageHelper";
import "@/i18n";
import App from "ViewMenu/App";
import "@/style/style.css";
import "antd/dist/antd.variable.css";
import "@/style/scss/styles.scss";
import { ConfigProvider } from "antd";
import { defaultTheme } from "@/util/constants";
import {
  changeTheme,
  getCurrentTheme,
  setThemeAttribute,
} from "@/util/themeHelper";

ConfigProvider.config({
  theme: {
    primaryColor: "green",
  },
});

// Clear the existing HTML content
const domNode = document.getElementById("root");

const themeName = getCurrentTheme();
changeTheme(themeName);

window.addEventListener("message", themeChangeHandler, false);

function themeChangeHandler(e: any) {
  if (e.data.type === "theme-changed") {
    setThemeAttribute(e.data.data);
  }
}

// document.documentElement.setAttribute(
//   "data-bs-theme",
//   bodyClassName || defaultTheme
// );

// document.body.className = bodyClassName || defaultTheme;

// Render your React component instead
const root = createRoot(domNode);
root.render(
  <CommonProvider>
    <App />
  </CommonProvider>
);
