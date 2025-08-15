import { useContext, useMemo, useEffect, Fragment } from "react";
import { menuContext } from "./Main";
import { MENU_LIST } from "./Menu";

interface IMenuItemProps {
  name: string;
  id: number;
  currentId?: number;
  parent?: number;
  children?: IMenuItemProps[];
  currentParent?: number;
}

export default function MenuItem(props: IMenuItemProps) {
  const { name, id, currentId, children, parent } = props;
  const { onMenuItemClick, showing } = useContext(menuContext);
  const menuItemClasses = useMemo(() => {
    return children
      ? "json-menu-noline"
      : parent
      ? " menu-sub"
      : "json-menu-item";
  }, [parent]);

  function onClickHandler() {
    onMenuItemClick(id);
  }

  function getChildren() {
    if (children) {
      const classes = showing.includes(id)
        ? "show-menu menu-children"
        : "hidden-menu menu-children";
      return (
        <div className={classes}>
          {children.map((menu) => {
            return <MenuItem currentId={currentId} key={menu.id} {...menu} />;
          })}
        </div>
      );
    } else {
      return null;
    }
  }

  function bgcolor() {
    return (
      (currentId === id && MENU_LIST.some((e) => e.id === currentId)) ||
      MENU_LIST.find((e) => e.id === id)?.children?.some(
        (item) => item.id === currentId
      )
    );
  }

  function menuFontcolor() {
    return parent > 0 && currentId === id;
  }

  return (
    <Fragment>
      <div
        className={`${menuItemClasses}${
          bgcolor() ? " json-menu-item-selected" : ""
        }${
          (menuFontcolor() ? " json-menu-noline-selected" : "") ||
          (bgcolor() ? " json-menu-text-selected" : "")
        }`}
        onClick={onClickHandler}
      >{`${name}`}</div>
      {getChildren()}
    </Fragment>
  );
}
