import MenuItem from "./MenuItem";

interface MenuProps {
  currentId?: number;
}

export const MENU_LIST = [
  { id: 1, name: "Json格式化", parent: 0 },
  { id: 2, name: "Base64", parent: 0 },
  { id: 3, name: "时间戳", parent: 0 },
  {
    id: 4,
    name: "加密",
    parent: 0,
    children: [
      { id: 5, name: "MD5", parent: 4 },
      { id: 6, name: "SHA-256", parent: 4 },
    ],
  },
  { id: 7, name: "编码", parent: 0 },
  { id: 8, name: "二维码转换", parent: 0 },
];

export default function Menu(props: MenuProps) {
  const { currentId = 0 } = props;
  return (
    <div className="json-menu">
      {MENU_LIST.map((menu) => {
        return <MenuItem currentId={currentId} key={menu.id} {...menu} />;
      })}
    </div>
  );
}
