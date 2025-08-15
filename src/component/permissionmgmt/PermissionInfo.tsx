import React, { useState, useEffect, useRef } from "react";
import {
  getPermissionList,
  createPermissionInfo,
  updatePermissionInfo,
  deletePermissionFromRole,
  getUserActivePermission,
} from "@/remote/permissionAction";
import { PermissionInfo, RolePermissionInfo } from "@/vo/Permission";
import { Button, Table, message } from "antd";
import PermissionInfoCell from "@/component/permissionmgmt/PermissionInfoCell";
import PermissionInfoRow from "@/component/permissionmgmt/PermissionInfoRow";
import { getMaxAsciiString } from "@/util/StringHelper";
import { column } from "@/component/common/ColumnsPermissionInfo";
import { UserInfo } from "@/util/Setting";
// import type { ColumnsType } from 'antd/es/table';

interface PermissionInfoProps {
  onDataBinState: string;
  onListInfoChange: (dragele?: string) => void;
  onGridInfoChange: (gridData?: PermissionInfo | PermissionInfo[]) => void;
}

export default function PermissionInfo(props: PermissionInfoProps) {
  const { onDataBinState, onListInfoChange, onGridInfoChange } = props;
  const [data, setData] = useState<PermissionInfo[]>(null);
  const [initData, setInitData] = useState<PermissionInfo[]>(null);
  const [rowInfo, setRowInfo] = useState<PermissionInfo>(null);
  const [loadingState, setLoadingState] = useState(false);
  const [addBtnDispay, setAddBtnDisplay] = useState<string>("none");

  const components = {
    body: {
      row: PermissionInfoRow,
      cell: PermissionInfoCell,
    },
  };

  useEffect(() => {
    initGetPermissionList({});
    setLoadingState(!loadingState);
    getUserActivePermissionList(UserInfo.userId);
  }, []);

  useEffect(() => {
    window?.addEventListener("switch", onSwitchEventHandler);
    window?.addEventListener("save", onBtnSaveEventHandler);
    window?.addEventListener("delete", onBtnDelEventHandler);
    return () => {
      window?.removeEventListener("switch", onSwitchEventHandler);
      window?.removeEventListener("save", onBtnSaveEventHandler);
      window?.removeEventListener("delete", onBtnDelEventHandler);
    };
  }, [data]);

  async function initGetPermissionList(param: PermissionInfo) {
    const permissionList = await getPermissionList(param).catch((error) => {
      alert(error);
      setData([]);
    });
    if (!permissionList) return;
    const permissionListObj = JSON.parse(permissionList as string);
    const permissionData = permissionListObj.data;
    setData(permissionData);
    setLoadingState(loadingState);
    setInitData(JSON.parse(JSON.stringify(permissionData)));
  }

  async function getUserActivePermissionList(params: string) {
    const permissionList = await getUserActivePermission(params).catch(
      (error) => {
        alert(error);
      }
    );
    if (!permissionList) return;
    const permissionListObj = JSON.parse(permissionList as string);
    const permissionData = permissionListObj.data;
    if (permissionData?.includes("U_C")) {
      setAddBtnDisplay("");
    }
  }

  const columns = column.map((col: any) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: PermissionInfo) => {
        return {
          record: record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          onInputEditSave: onInputEditSaveHandler,
        };
      },
    };
  });

  function onBtnAddRowHandler() {
    if (data?.some((ele) => ele.id === -1)) {
      alert("仅可新增一行,请勿重复点击!");
      return;
    }
    const newRow: PermissionInfo = {
      id: -1,
      code: "",
      name: "",
      description: "",
      active: "Y",
    };
    setData([newRow, ...data]);
  }

  function onSwitchEventHandler(switchValue: CustomEvent) {
    const dataIndex = data.findIndex(
      (item) => item.id === switchValue.detail.id
    );
    data[dataIndex].active = switchValue.detail.active;
  }

  function onInputEditSaveHandler(oneRow: PermissionInfo) {
    const newData = [...data];
    const dataIndex = newData.findIndex((item) => oneRow.id === item.id);
    newData.splice(dataIndex, 1, { ...oneRow });
    setData(newData);
  }

  function onBtnSaveEventHandler(saveValue: CustomEvent) {
    onBtnSaveClickHandler(saveValue.detail);
  }

  async function onBtnSaveClickHandler(saveValue: PermissionInfo) {
    const oneRow: PermissionInfo = {};
    oneRow.id = saveValue.id;
    oneRow.code = saveValue.code;
    oneRow.name = saveValue.name;
    oneRow.description = saveValue.description;
    oneRow.active = saveValue.active;

    if (!oneRow.code.trim() || !oneRow.name.trim() || !oneRow.active) {
      alert("权限和代码为必输项!");
      return;
    }

    if (getMaxAsciiString(oneRow.code.trim()) > 50) {
      alert("代码输入长度不能大于50!");
      return;
    }

    if (getMaxAsciiString(oneRow.name.trim()) > 255) {
      alert("权限长度不能大于255!");
      return;
    }

    if (getMaxAsciiString(oneRow.description.trim()) > 500) {
      alert("备注长度不能大于500!");
      return;
    }

    const object: PermissionInfo = {};
    object.code = oneRow.code.trim();
    object.name = oneRow.name.trim();
    object.description = oneRow?.description.trim() ?? "";
    object.active = oneRow.active;

    if (oneRow.id === -1) {
      const result = await createPermissionInfo(object);
      const resultData = JSON.parse(result as string);
      if (resultData.error) {
        alert(resultData.error);
        return;
      }
      oneRow.id = resultData.data.id;
      message.success("新增权限成功");
      initGetPermissionList({});
    } else if (oneRow.id) {
      const tempData = JSON.parse(JSON.stringify(initData));
      const currentInitData = tempData.find((f: any) => f.id === oneRow.id); //上一次的值
      if (
        currentInitData.name !== oneRow.name ||
        currentInitData.code !== oneRow.code ||
        currentInitData.description !== oneRow.description ||
        currentInitData.active !== oneRow.active
      ) {
        const result = await updatePermissionInfo(oneRow);
        const resultData = JSON.parse(result as string);
        if (resultData.error) {
          alert(resultData.error);
          return;
        } else {
          message.success("权限信息修改成功");
          onGridInfoChange(oneRow);
          setRowInfo(oneRow);
          const index = tempData.findIndex((ele: any) => ele.id === oneRow.id);
          tempData.splice(index, 1, oneRow);
          setInitData(tempData);
          initGetPermissionList({});
        }
      } else {
        message.warning("无修改");
        return;
      }
    }
  }

  function onBtnDelEventHandler(deleteValue: CustomEvent) {
    onBtnDelClickHandler(deleteValue.detail);
  }

  async function onBtnDelClickHandler(deleteValue: PermissionInfo) {
    const oneRow: PermissionInfo = {};
    oneRow.id = deleteValue.id;

    if (oneRow.id === -1) {
      const newData = data.filter((item) => item.id !== oneRow.id);
      setData(newData);
      message.success("权限删除成功");
      return;
    }

    const object: PermissionInfo = {};
    object.id = oneRow.id;
    object.isDelete = "Y";

    const result = await updatePermissionInfo(object);
    const resultData = JSON.parse(result as string);

    if (resultData.error) {
      alert(resultData.error);
    } else {
      const newData = data.filter((item) => item.id !== oneRow.id);
      setData(newData);
      onGridInfoChange(newData);
      message.success("删除成功");
    }
  }

  function onDataBinDragOverHandler(ev: React.DragEvent<HTMLParagraphElement>) {
    ev.preventDefault();
  }

  async function onDataBinDropHandler(
    ev: React.DragEvent<HTMLParagraphElement>
  ) {
    const alertInfo = confirm("确定删除吗?");
    if (alertInfo === true) {
      const getListData = JSON.parse(ev.dataTransfer.getData("text"));
      const object: RolePermissionInfo = {};
      object.roleId = getListData.dragParent;
      object.permissionId = getListData.dragItem;

      const result = await deletePermissionFromRole(object);
      const resultdata = JSON.parse(result as string);

      if (resultdata.error) {
        alert(resultdata.error);
      } else {
        onListInfoChange(getListData);
        alert("删除成功!");
      }
    }
  }

  return (
    <div className="per-table-box Info-style role-right-container">
      <div
        className="flex-end"
        style={{ margin: "0 0 10px 0", display: addBtnDispay }}
      >
        <Button
          type="primary"
          onClick={onBtnAddRowHandler}
          style={{ width: 145 }}
        >
          Add a Permisson
        </Button>
      </div>
      <Table
        components={components}
        dataSource={data}
        columns={columns}
        bordered
        loading={loadingState}
        rowClassName={() => "editable-row"}
        rowKey={(data) => (data.id ? data.id : Math.random())}
        onRow={() => {
          const attr = {
            initData,
            rowInfo,
          };
          return attr as React.HTMLAttributes<any>;
        }}
      ></Table>
      <div
        className="data-bin-box"
        onDragOver={onDataBinDragOverHandler}
        onDrop={onDataBinDropHandler}
        style={{ display: onDataBinState }}
      >
        <div className="data-bin"></div>
      </div>
    </div>
  );
}
