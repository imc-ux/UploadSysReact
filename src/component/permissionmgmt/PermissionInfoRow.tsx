import React, { useState, useEffect, useRef } from "react";
import { Form } from "antd";
import { PermissionInfo } from "@/vo/Permission";
// import type {FormInstance} from 'antd/es/form';
import { getUserActivePermission } from "@/remote/permissionAction";
import { UserInfo } from "@/util/Setting";

export const EditableContext = React.createContext<any | null>(null);

interface PermissionInfoRowProps {
  initData: PermissionInfo[];
  rowInfo: PermissionInfo;
  children: any[];
}

export default function PermissionInfoRow(prop: PermissionInfoRowProps) {
  const { initData, rowInfo, ...props } = prop;
  const [draggable, setDraggable] = useState(false);
  const [form] = Form.useForm();
  const permissionRef = useRef(null);

  useEffect(() => {
    if (
      rowInfo &&
      prop?.children?.[0]?.props?.record?.id &&
      prop.children[0].props.record.id === rowInfo.id
    ) {
      setDraggable(true);
    }
  }, [rowInfo]);

  useEffect(() => {
    getUserActivePermissionList(UserInfo.userId);

    return () =>
      window.removeEventListener("permissionCellEditor", onCellEditorHandler);
  }, []);

  function onCellEditorHandler(e: any) {
    if (permissionRef.current?.data?.includes("U_C")) {
      setDraggable(!e.detail.isPermissionCellEditor);
    }
  }

  async function getUserActivePermissionList(params: string) {
    const permissionList = await getUserActivePermission(params).catch(
      (error) => {
        alert(error);
      }
    );
    const permissionData = JSON.parse(permissionList as string);
    permissionRef.current = permissionData;
    if (permissionData?.data?.includes("U_C")) {
      window.addEventListener("permissionCellEditor", onCellEditorHandler);
      setDraggable(true);
    } else {
      setDraggable(false);
    }
  }

  function onRowDragStartHandler(ev: React.DragEvent<HTMLTableRowElement>) {
    const dragRowData = prop.children?.[0].props.record;
    if (dragRowData.id === -1) {
      setDraggable(false);
      alert("请确认必填项并保存数据后拖动!");
      return;
    }

    const currentInitData = initData.find((f: any) => f.id === dragRowData.id);
    if (
      currentInitData.name !== dragRowData.name ||
      currentInitData.code !== dragRowData.code ||
      currentInitData.description !== dragRowData.description ||
      currentInitData.active !== dragRowData.active
    ) {
      setDraggable(false);
      alert("请先保存数据后再拖动权限!");
    } else {
      const dragRow = {
        dragEle: prop.children?.[0].props.record,
        drag: "rowData",
      };
      if (dragRow) {
        var img = new Image();
        img.src = "../../static/images/alertbg.png";
        ev.dataTransfer.setDragImage(img, 2, 2);
        console.log("aaa", img.src);
      }

      ev.dataTransfer.setData("text", JSON.stringify(dragRow));
    }
  }

  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr
          {...props}
          draggable={draggable}
          onDragStart={onRowDragStartHandler}
        ></tr>
      </EditableContext.Provider>
    </Form>
  );
}
