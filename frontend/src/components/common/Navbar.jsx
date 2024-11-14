import { Outlet, useNavigate  } from "react-router-dom";
import { useSelector, useDispatch} from "react-redux";
import { logoutUser } from "@/redux/slices/authSlice";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const Navbar = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle logout function
  const handleLogout = async () => {
    try {
      const result = await dispatch(logoutUser());
      if (logoutUser.fulfilled.match(result)) {
        toast.success("Logged out successfully!"); // Success message
        if (user?.role === "Admin") {
          navigate("/"); // Navigate to the admin dashboard
        } else {
          navigate("/login/user"); // Navigate to user login
        }
      } else {
        // Handle unsuccessful logout attempt
        throw new Error(result.payload.message || "Logout failed.");
      }
    } catch (error) {
      console.error("Logout Error:", error.message);
      toast.error("Error logging out: " + (error.message || "Please try again."));
    }
  };


  return (
    <div>
      <header className=" h-16 py-3 px-5 flex mx-auto items-center justify-between sticky top-0 shadow-md z-50 bg-white">
        <h1 className="flex mr-auto text-3xl font-bold text-center">
          Admin 
        </h1>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex gap-4 items-center font-bold text-sm">
        </nav>

        <div className="px-4 items-center xs:flex text-center text-slate-500 hidden"> | </div>

        {/* Social Icons (visible on all screen sizes) */}
        <div className="hidden xs:flex items-center gap-4 text-slate-500">

        </div>

        

        {/* Sign-in Button (visible on larger screens) */}
        <div className="flex items-center gap-4 px-4">
        {isLoggedIn ? (
          <div className="px-2 hidden sm:flex items-center gap-4 text-slate-800">
            <div>
              <p>Welcome, {user?.name?.split(" ")[0]}</p>
            </div>
          </div>
        ) : null}
        {isLoggedIn ? (
              <Button className="hover:bg-greenMango" onClick={handleLogout}>Sign Out</Button>
          ) : null}
        </div>
      </header>
      <main className="min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default Navbar;
