import { HashRouter, Routes, Route } from "react-router-dom";
import Main from "@/component/convert/Main";
import PermissionMain from "@/component/permissionmgmt/PermissionMain";
import RoleManagement from "@/component/role/RoleManagement";
import Share from "@/component/sharemgmt/ShareMain";
import MainMenu from "ViewMenu/Main";
import Login from "ViewMenu/Login";

export default function Router() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/menu" element={<MainMenu />} />
        <Route path="/main" element={<Main />} />
        <Route path="/permission" element={<PermissionMain />} />
        <Route path="/role" element={<RoleManagement />} />
        <Route path="/share" element={<Share />} />
      </Routes>
    </HashRouter>
  );
}
