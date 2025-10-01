import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import BottomNav from "../components/common/BottomNav";

export default function MainLayout() {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="content flex-grow-1">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
