import { useState, createContext } from "react";
import Menu from "./Menu";
import Content from "./Content";
import { MENU_LIST } from "./Menu";
import { changeTheme, changeThemeMode } from "@/util/themeHelper";
import { ThemeMode } from "@/util/constants";

interface IMenuContext {
  onMenuItemClick: (id: number) => void;
  showing: number[];
}

export const menuContext = createContext<IMenuContext>(null);

export default function Main() {
  const [id, setId] = useState(1);
  const [currentId, setCurrentId] = useState(0);
  const [showingMenu, setShowingMenu] = useState<number[]>([]);

  function onMenuClickHandler(id: number) {
    setCurrentId(id);
    if (MENU_LIST.find((item) => item.id === id)?.children) {
      if (showingMenu.includes(id)) {
        setShowingMenu((s) => {
          const result = [...s];
          result.splice(
            result.findIndex((i) => i === id),
            1
          );
          return result;
        });
      } else {
        setShowingMenu((s) => {
          return [...s, id];
        });
      }
    } else {
      setId(id);
    }
  }
  // ===================测试主题==============================
  // function onThemeSwitchChangeHandler(e: any) {
  //   if (e.target.checked) {
  //     changeTheme("ux-green-light");
  //   } else {
  //     changeTheme("ux-dark");
  //   }
  // }

  // function onThemeModeSwitchChangeHandler(e: any) {
  //   if (e.target.checked) {
  //     changeThemeMode(ThemeMode.Dark);
  //   } else {
  //     changeThemeMode(ThemeMode.Light);
  //   }
  // }
  // ============================================================
  return (
    <div className="menu-height">
      <div className="main-content">
        <menuContext.Provider
          value={{ onMenuItemClick: onMenuClickHandler, showing: showingMenu }}
        >
          <Menu currentId={currentId} />
        </menuContext.Provider>
        <Content id={id} />
      </div>
      {/* 测试用=================================== */}
      {/* <div className="form-check form-switch flex-column">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id="switchCheckDefault"
          onChange={onThemeSwitchChangeHandler}
        />
        主题
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id="switchCheckDefault"
          onChange={onThemeModeSwitchChangeHandler}
        />
        亮暗
      </div> */}
      {/* 测试用=================================== */}
    </div>
  );
}
