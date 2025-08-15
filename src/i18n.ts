import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resources from "Common/constant/languageResources";

i18n.use(initReactI18next).init({
  resources,
  lng: "cn",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
