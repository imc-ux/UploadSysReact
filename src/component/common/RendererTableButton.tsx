import React, { useState, useEffect } from "react";
import { Button, Switch, Popconfirm } from "antd";
import { DeleteOutlined, CheckSquareOutlined } from "@ant-design/icons";
import { getUserActivePermission } from "@/remote/roleAction";
import { UserInfo } from "@/util/Setting";

export function RendererTableButton(props: any) {
  const { record } = props;
  const [switchChecked, setSwitchChecked] = useState(record.active === "Y");
  const [btnRendererDisplay, setBtnRendererDisplay] = useState<string>("none");
  const [switchBtnDisplay, setSwitchBtnDisplay] = useState<string>("");

  useEffect(() => {
    getUserActivePermissionList(UserInfo.userId);
    if (record?.code === "manager") {
      setSwitchBtnDisplay("none");
    }
  }, []);

  async function getUserActivePermissionList(params: string) {
    const permissionList = await getUserActivePermission(params).catch(
      (error) => {
        alert(error);
      }
    );
    if (!permissionList) return;
    const permissionData = JSON.parse(permissionList as string);
    if (permissionData.data?.includes("U_D") && record?.code !== "manager") {
      setBtnRendererDisplay("");
    }
  }

  function onSwitchHandler(e: boolean) {
    setSwitchChecked(e);
    const switchEvent = new CustomEvent("switch", {
      detail: {
        id: record.id,
        active: e ? "Y" : "N",
        code: record.code,
        name: record.name,
        description: record.description,
      },
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(switchEvent);
  }

  function onBtnSaveClickHandler() {
    const saveEvent = new CustomEvent("save", {
      detail: {
        id: record.id,
        code: record.code,
        name: record.name,
        active: record.active,
        description: record.description,
      },
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(saveEvent);
  }

  function onDeleteClickHandler() {
    const deleteEvent = new CustomEvent("delete", {
      detail: {
        id: record.id,
      },
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(deleteEvent);
  }

  return (
    <div className="align-right">
      <Switch
        onClick={onSwitchHandler}
        checked={switchChecked}
        style={{ display: switchBtnDisplay }}
      ></Switch>
      <Button
        className="button-space"
        type="primary"
        shape="circle"
        icon={(<CheckSquareOutlined />) as any}
        size={"large"}
        name="save"
        onClick={onBtnSaveClickHandler}
        style={{ display: btnRendererDisplay }}
      ></Button>
      <Popconfirm title="确定要删除吗？" onConfirm={onDeleteClickHandler}>
        <Button
          type="primary"
          shape="circle"
          icon={(<DeleteOutlined />) as any}
          size={"large"}
          className="button-space"
          name="delete"
          style={{ display: btnRendererDisplay }}
        ></Button>
      </Popconfirm>
    </div>
  );
}
