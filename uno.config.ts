import { defineConfig } from "@unocss/webpack";
import presetUno from "@unocss/preset-uno";
import presetAttributify from "@unocss/preset-attributify";
import transformerAttributifyJsx from "@unocss/transformer-attributify-jsx";
import presetIcons from "@unocss/preset-icons";
import { RuntimeGlobals } from "webpack";
// import { defineConfig, presetAttributify } from "unocss";

export default defineConfig({
  theme: {},
  rules: [
    ["bg-custom", { "background-color": "var(--bg-color)" }],
    // ["bg-primary", { "background-color": "#2495e1" }],
    // ["bg-avtive", { "background-color": "#198cda" }],
    ["accent-primary", { "accent-color": "var(--secondary-color)" }],
    ["login-gray-text", { color: "#5d5d5d", cursor: "pointer" }],
    ["icon-box-bg", { "background-color": "rgba(0,0,0,0.2)" }],
    ["modal-bg", { "background-color": "rgba(0,0,0,0.4)" }],
    [
      "gradient-border",
      {
        "border-bottom": "1px solid",
        "border-image":
          "linear-gradient(90deg,rgba(64, 132, 130, 0),rgba(64, 132, 130, 0.2) 6%,#408482 32%,#83c4c2 52%,#eca639 80%,rgba(236, 166, 57, 0.1) 95%,rgba(236, 166, 57, 0) 100%)2",
      },
    ],
    [
      "login-input",
      {
        height: "44px",
        "border-radius": "2px",
        border: "1px solid #c9c9c9",
        width: "100%",
        "font-size": "16px",
        "padding-left": "6px",
        outline: "none",
      },
    ],
    [
      "border-focus",
      {
        border: "1px solid #2495e1",
      },
    ],
    [
      "alert-shadow",
      {
        boxShadow: "2px 2px 4px rgba(0,0,0,0.6)",
      },
    ],
    [
      "alert-title-rounded",
      {
        "border-radius": "5px 5px 0 0",
      },
    ],
    ["bg-gray-light", { "background-color": "#EAF0F2" }],
  ],
  shortcuts: {
    "flex-center": "flex items-center justify-center",
    "icon-box":
      "w-32px h-32px flex-center cursor-pointer hover:icon-box-bg rounded-1/2",
    "bg-active": "bg-[var(--iux-top-menu-active-bg)]",
    "bg-btn-active": "bg-[var(--btn-active-color)]",
    "menu-text": "c-[var(--iux-top-menu-color)]",
    "bg-bottom-line": "bg-[var(--iux-top-menu-color)]",
    "bg-menu": "bg-[var(--iux-top-menu-bg)]",
    "bg-primary": "bg-[var(--iux-primary-bg)]",
    "version-border":
      "border-1 border-solid border-[var(--iux-top-menu-color)] rounded-1/2",
    "bg-pop-title": "bg-[var(--iux-pop-title-bg)]",
    "pop-title-text": "c-[var(--iux-pop-title-color)]",
    "pop-content-bg": "bg-[var(--iux-pop-content-bg)]",
    "alert-text": "c-[var(--iux-alert-text)]",
    "c-active": "c-[var(--active-text-color)]",
    "alert-btn":
      "border-none min-w-50px text-14px color-white rounded-15px cursor-pointer leading-30px bg-primary hover:bg-active ",
    "lang-hover-bg": "bg-[var(--iux-lang-hover-bg)]",
  },
  presets: [presetUno(), presetAttributify(), presetIcons()],
  transformers: [transformerAttributifyJsx()],
});
