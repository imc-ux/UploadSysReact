import React, { useState, useEffect, useRef } from "react";
import { Collapse } from "antd";
import GetUserRole from "@/component/common/UserRole";
import { createRoleToUser } from "@/remote/roleAction";
import { getUserRoleList, deleteRoleFromUser } from "@/remote/roleAction";
import { UserRoleInfo } from "@/vo/Role";

export default function RolePart1(props: any) {
  const { dropValue, roleValue, onDropCallback, ...otherProps } = props;
  const { Panel } = Collapse;
  const [data, setData] = useState(null);
  const [activeKey, setActiveKey] = useState(null);
  const elementRef = useRef<HTMLElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    initUserRoleList();
  }, []);

  useEffect(() => {
    initUserRoleList();
  }, [count]);

  useEffect(() => {
    if (dropValue) {
      onRoleClearDropHandler(dropValue);
    }
  }, [dropValue]);

  useEffect(() => {
    if (roleValue > 0) {
      initUserRoleList();
    }
  }, [roleValue]);

  async function initUserRoleList() {
    try {
      const result = await getUserRoleList();
      const arr = JSON.parse(result as string);
      setData(arr.data);
    } catch (e) {
      setData([]);
    }
  }

  function onDragOverHandler(e: any) {
    const className =
      e.target?.parentElement?.parentElement?.getAttribute("class");
    if (className?.match(/col-([^\s]+)/g)) {
      e.preventDefault();
    }
  }

  async function onMenuDropHandler(ev: any) {
    const role = JSON.parse(ev.dataTransfer.getData("text"));
    if (role?.active) {
      const className =
        ev.target?.parentElement?.parentElement?.getAttribute("class");
      if (className && className.match(/col-(.+)/g)) {
        ev.preventDefault();
      }
      const array = [...data];
      const currentItem = array.find((ele) => ele.userId === RegExp.$1);
      if (currentItem?.children?.some((ele: any) => ele.id === role.id)) {
        alert(" 重复添加! ");
        return;
      }
      const roleInfo: UserRoleInfo = {};
      roleInfo.userId = currentItem.userId;
      roleInfo.roleId = role.id;
      const result = await createRoleToUser(roleInfo);
      const returnData = JSON.parse(result as string);
      if (returnData.error) {
        alert(" error! ");
        return;
      }
      if (!currentItem.children) {
        [(currentItem["children"] = [role])];
      } else {
        currentItem.children.push(role);
      }
      setData(array);
      setActiveKey(roleInfo.userId);
      setCount(count + 1);
    }
  }

  async function onRoleClearDropHandler(value: any) {
    const arr = [...data];
    if (window.confirm("Are you sure delete?")) {
      const index = arr.findIndex((ele) => ele.userId === value.code);
      const roleInfo: UserRoleInfo = {};
      roleInfo.userId = arr[index].userId;
      arr[index].children.map((e: any) => {
        if (String(e.id) === String(value.id)) {
          roleInfo.roleId = e.id;
        }
      });
      const result = await deleteRoleFromUser(roleInfo);
      const resultData = JSON.parse(result as string);
      if (resultData.error) {
        alert("error");
        return;
      }
      arr[index].children.splice(
        arr[index].children.findIndex(
          (item: any) => String(item.id) === String(value.id)
        ),
        1
      );
      if (arr[index].children.length === 0) {
        alert("删空了");
      }
      setData(arr);
      onDropCallback?.("none");
      setCount(count + 1);
    }
  }

  function onRoleDragEndHandler() {
    onDropCallback?.("none");
  }

  function ondragStartHandler(ev: React.DragEvent<HTMLParagraphElement>) {
    onRoleDragStartHandler(ev);
  }

  function onRoleDragStartHandler(ev: React.DragEvent<HTMLParagraphElement>) {
    const target = ev.currentTarget as HTMLElement;
    const dragData = {
      code: target.dataset.code,
      id: target.dataset.id,
      name: target.dataset.name,
    };
    ev.dataTransfer.setData("text/plain", JSON.stringify(dragData));
    elementRef.current = document.body.appendChild(
      target.cloneNode(true) as HTMLElement
    );
    elementRef.current.setAttribute(
      "style",
      "width:200px;background-color:green;"
    );
    ev.dataTransfer.setDragImage(elementRef.current, 10, 10);
    onDropCallback?.("block");
  }

  function onChangeHandler(key: string | string[]) {
    setActiveKey(key);
  }

  function ondragEndHandler() {
    if (elementRef.current) {
      document.body.removeChild(elementRef.current);
    }
  }

  function onMenuDragOverHandler(ev: React.DragEvent<HTMLTableRowElement>) {
    ev.preventDefault();
  }

  function onroleOverHandler(ev: any) {
    ev.preventDefault();
  }

  return (
    <div
      {...otherProps}
      onDragOver={onDragOverHandler}
      onDrop={onMenuDropHandler}
      onDragEnd={onRoleDragEndHandler}
    >
      <Collapse
        activeKey={activeKey}
        bordered={false}
        accordion
        className="collapse"
        onChange={onChangeHandler}
      >
        {data?.map((e: any) => {
          return (
            <Panel
              id={e.userId}
              header={e.userName}
              key={e.userId}
              className={`col-${e.userId}`}
            >
              <GetUserRole
                user={e}
                ondragStart={ondragStartHandler}
                ondragEnd={ondragEndHandler}
                onDragOver={onMenuDragOverHandler}
                onroleOver={onroleOverHandler}
                onDrop={onMenuDropHandler}
              />
            </Panel>
          );
        })}
      </Collapse>
    </div>
  );
}
