import React, { useState, useEffect, useRef } from "react";
import { PermissionInfo } from "@/vo/Permission";
import { Button, Popconfirm, Space, Switch, message } from "antd";
import { DeleteOutlined, CheckSquareOutlined } from "@ant-design/icons";
import { getUserActivePermission } from "@/remote/permissionAction";
import { UserInfo } from "@/util/Setting";

export const column: any & { editable?: boolean } = [
  {
    title: "权限",
    dataIndex: "name",
    width: 250,
    align: "center",
    editable: true,
    ellipsis: true,
  },
  {
    title: "代码",
    dataIndex: "code",
    width: 100,
    align: "center",
    editable: true,
    ellipsis: true,
  },
  {
    title: "备注",
    dataIndex: "description",
    width: 330,
    align: "center",
    editable: true,
    ellipsis: true,
  },
  {
    title: "操作",
    dataIndex: "operation",
    width: 170,
    align: "center",
    render: (_: any, permissionMsg: PermissionInfo) => {
      return <RendererButtonGroups permissionMsg={permissionMsg} />;
    },
  },
];

interface RendererButtonGroupsProps {
  permissionMsg: PermissionInfo;
}

function RendererButtonGroups(props: RendererButtonGroupsProps) {
  const { permissionMsg } = props;
  const [switchStatus, setSwitchStatus] = useState(
    permissionMsg.active === "Y"
  );
  const [rendererDisplay, setRendererDisplay] = useState<string>("none");
  const [space, setSpace] = useState<string>("btn-renderer");

  useEffect(() => {
    getUserPermissionList(UserInfo.userId);
  }, []);

  async function getUserPermissionList(params: string) {
    const permissionList = await getUserActivePermission(params).catch(
      (error) => {
        alert(error);
      }
    );
    if (!permissionList) return;
    const permissionData = JSON.parse(permissionList as string);
    if (permissionData.data.includes("U_C")) {
      setRendererDisplay("");
      setSpace("");
    }
  }

  function onSwitchEventHandler(state: boolean) {
    setSwitchStatus(state);
    const switchEvent = new CustomEvent("switch", {
      detail: {
        id: permissionMsg.id,
        active: state ? "Y" : "N",
      } as PermissionInfo,
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(switchEvent);
  }

  function onBtnSaveEventHandler() {
    const saveEvent = new CustomEvent("save", {
      detail: {
        id: permissionMsg.id,
        code: permissionMsg.code,
        name: permissionMsg.name,
        description: permissionMsg.description,
        active: permissionMsg.active,
      } as PermissionInfo,
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(saveEvent);
  }

  function onBtnDelEventHandler() {
    const deleteEvent = new CustomEvent("delete", {
      detail: {
        id: permissionMsg.id,
      } as PermissionInfo,
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(deleteEvent);
  }

  function cancelMsg() {
    message.error("取消操作");
  }

  return (
    <div className={space}>
      {/* <Space size="middle"> */}
      <Switch checked={switchStatus} onChange={onSwitchEventHandler}></Switch>
      <Popconfirm
        title="Sure to save?"
        onConfirm={onBtnSaveEventHandler}
        onCancel={cancelMsg}
      >
        <Button
          type="primary"
          icon={(<CheckSquareOutlined />) as any}
          style={{ display: rendererDisplay }}
          className="button-space"
        ></Button>
      </Popconfirm>
      <Popconfirm
        title="Sure to delete?"
        onConfirm={onBtnDelEventHandler}
        onCancel={cancelMsg}
      >
        <Button
          type="primary"
          icon={(<DeleteOutlined />) as any}
          style={{ display: rendererDisplay }}
          className="button-space"
        ></Button>
      </Popconfirm>
      {/* </Space> */}
    </div>
  );
}
