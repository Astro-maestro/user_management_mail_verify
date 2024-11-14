import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchDashboard } from "../../redux/slices/authSlice"; // Adjust the path as needed
import { Button } from "@/components/ui/button"; // Assuming you have a Button component styled with Tailwind

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Fetch user details when Sidebar mounts
    dispatch(fetchDashboard());
  }, [dispatch]);

  return (
    <div className="flex flex-col w-64 h-full bg-gray-800 text-white p-4 space-y-6">
      {/* Sidebar Header */}
      <div className="text-xl font-semibold mb-4">
      {`Welcome, ${user.name}`}
      </div>

      {/* Conditionally Render User Management Section */}
      {user?.role === "Admin" && (
        <div className="space-y-2">
          <h2 className="text-lg font-medium">User Management</h2>
          <Button 
            onClick={() => navigate("/user/register")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
          >
            Create User
          </Button>
        </div>
      )}

      {/* Divider */}
      <hr className="border-gray-600 my-4" />

      {/* Update Password Section */}
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Update Password</h2>
        <Button 
          onClick={() => navigate("/update-password")}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"
        >
          Update Password
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
