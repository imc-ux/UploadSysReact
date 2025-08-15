import { ThemeItemInfo } from "../constant/dataSource";

interface ThemeItem {
  themeInfo: ThemeItemInfo;
  selected: boolean;
  onClick: () => void;
}

export default function ThemeListItem(props: ThemeItem) {
  function onThemeItemClickHandler() {
    props.onClick?.();
  }

  return (
    <div
      w-full
      flex
      p-2
      className={
        props.selected
          ? "theme-list-item theme-list-item-selected"
          : "theme-list-item"
      }
      onClick={onThemeItemClickHandler}
    >
      <span
        className="i-mdi-palette"
        style={{ color: props.themeInfo.color ?? "black" }}
        text-2xl
        mr-2
      />
      <span className="theme-name-text">{props.themeInfo.themeTitle}</span>
    </div>
  );
}
