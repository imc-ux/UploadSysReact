import { useState } from "react";
import RolePart1 from "@/component/role/RolePart1";
import RolePart2 from "@/component/role/RolePart2";
import { DeleteOutlined } from "@ant-design/icons";
import { changeTheme, changeThemeMode } from "@/util/themeHelper";
import { ThemeMode } from "@/util/constants";

export default function RoleManagement() {
  const [block, setBlock] = useState("none");
  const [dropValue, setDropValue] = useState(null);
  const [roleValue, setRoleValue] = useState(0);

  function onClearOverHandler(ev: React.DragEvent<HTMLDivElement>) {
    ev.preventDefault();
  }

  function onRoleDragEndHandler() {
    setBlock("none");
  }

  function onRoleClearDropHandler(ev: React.DragEvent<HTMLDivElement>) {
    const value = JSON.parse(ev.dataTransfer.getData("text"));
    setDropValue(value);
    setBlock("none");
    setRoleValue((d) => ++d);
  }

  function onDropCallbackHandler(state: string) {
    setBlock(state);
    console.log("state", state);
  }

  function onDataChangedHandler() {
    setRoleValue((d) => ++d);
  }
  // =======================测试主题================================
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
    <div className="div-flex">
      <RolePart1
        className="role-left-container"
        dropValue={dropValue}
        roleValue={roleValue}
        onDropCallback={onDropCallbackHandler}
      />
      <RolePart2
        className="role-right-container"
        onDataChanged={onDataChangedHandler}
      />
      <div
        style={{ display: block }}
        className="clear-div"
        onDragOver={onClearOverHandler}
        onDrop={onRoleClearDropHandler}
        onDragEnd={onRoleDragEndHandler}
      >
        <DeleteOutlined className="DeleteOutlined" />
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
