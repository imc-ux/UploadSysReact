import React, { useState, useEffect, useRef } from "react";
import { Form } from "antd";
import type { FormInstance } from "antd/es/form";
import { getUserActivePermission } from "@/remote/roleAction";
import { UserInfo } from "@/util/Setting";

export const EditableContext = React.createContext<FormInstance<any> | null>(
  null
);

export default function EditableRow(prop: any) {
  const { ...props } = prop;
  const [form] = Form.useForm();
  const [isdrag, setIsDrag] = useState<boolean>(false);
  const permissionRef = useRef(null);

  useEffect(() => {
    getUserActivePermissionList(UserInfo.userId);
    return () => window.removeEventListener("cellEditor", onCellEditorHandler);
  }, []);

  function onCellEditorHandler(e: any) {
    setIsDrag(!e.detail.isCellEditor);
  }

  function dragStartHandler(ev: React.DragEvent<HTMLTableRowElement>) {
    ev.currentTarget.style.border = "2px solid red";
    ev.dataTransfer.setData(
      "text/plain",
      JSON.stringify(props.children?.[0]?.props?.record)
    );
  }

  async function getUserActivePermissionList(params: string) {
    const permissionList = await getUserActivePermission(params).catch(
      (error) => {
        alert(error);
      }
    );
    const permissionData = JSON.parse(permissionList as string);
    permissionRef.current = permissionData.data;
    if (permissionData.data?.includes("U_D")) {
      window.addEventListener("cellEditor", onCellEditorHandler);
      setIsDrag(true);
    } else {
      setIsDrag(false);
    }
  }

  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} draggable={isdrag} onDragStart={dragStartHandler}></tr>
      </EditableContext.Provider>
    </Form>
  );
}
