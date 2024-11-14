import Sidebar from "../common/Sidebar";
import Dashboard from "./Dashboard";

const AdminHome = () => {
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      {/* Sidebar styling */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200">
        <Sidebar />
      </div>

      {/* Dashboard styling */}
      <div className="flex-1 p-6 md:p-8  overflow-y-auto">
        <Dashboard />
      </div>
    </div>
  );
};

export default AdminHome;
