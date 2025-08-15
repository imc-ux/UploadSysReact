import { Outlet } from "react-router-dom";
import "@/style/style.css";
import "antd/dist/antd.variable.css";
import { ConfigProvider } from "antd";

ConfigProvider.config({
  theme: {
    primaryColor: "green",
  },
});

export default function Tools() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
