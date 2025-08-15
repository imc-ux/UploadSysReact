import { useState } from "react";
import RoleList from "@/component/permissionmgmt/RoleList";
import PermissionInfo from "@/component/permissionmgmt/PermissionInfo";
import { PermissionInfo as PermissionType } from "@/vo/Permission";
import { changeTheme, changeThemeMode } from "@/util/themeHelper";
import { ThemeMode } from "@/util/constants";
// import PermissionInfoProps from '@/component/permissionmgmt/PermissionInfo';

export default function PermissionMain() {
  const [display, setDisplay] = useState("none");
  const [listInfo, setInfo] = useState("");
  const [gridInfo, setGridInfo] = useState<PermissionType | PermissionType[]>(
    null
  );

  function onListDropCallbackHandler(state: string) {
    setDisplay(state);
  }

  function onListInfoChangeHandler(listInfo: string) {
    setInfo(listInfo);
  }

  function onGridInfoChangeHandler(
    gridInfo: PermissionType | PermissionType[]
  ) {
    setGridInfo(gridInfo);
  }
  // =========================测试主题用====================================
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
  // ====================================================

  return (
    <div className="dis-flex">
      <RoleList
        onListDropCallback={onListDropCallbackHandler}
        listInfo={listInfo}
        gridInfo={gridInfo}
      />
      <PermissionInfo
        onDataBinState={display}
        onListInfoChange={onListInfoChangeHandler}
        onGridInfoChange={onGridInfoChangeHandler}
      />
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
