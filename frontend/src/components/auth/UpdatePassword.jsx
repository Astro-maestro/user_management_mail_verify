import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword } from "@/redux/slices/authSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { logoutUser } from '../../redux/slices/authSlice'

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const { loading, error, user  } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
  });
  const [errors, setErrors] = useState({});


  useEffect(() => {
    console.log("UpdatePassword component mounted");
    return () => console.log("UpdatePassword component unmounted");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name} = ${value.replace(/./g, "*")}`);
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    console.log("Validating form");
    let newErrors = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    console.log("Validation errors:", newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    if (validateForm()) {
      console.log("Form is valid, attempting to update password");
      try {
        const passwordData = { password: formData.password };
        console.log("Dispatching updatePassword action");
        const resultAction = await dispatch(updatePassword(passwordData));

        console.log("Update password action result:", resultAction);

        if (updatePassword.fulfilled.match(resultAction)) {
          console.log("Password updated successfully");
          toast.success("Password updated successfully!");
          setFormData({ password: "" });
          await dispatch(logoutUser());
          if(user?.role === "Admin"){
            navigate("/");
          }else{
            navigate("/login/user");
          }
        } else {
          console.log("Password update failed");
          const errorMessage =
            resultAction.payload?.message ||
            "Password update failed. Please try again.";
          toast.error(errorMessage);
        }
      } catch (error) {
        console.error("Password update error:", error);
        toast.error("Password update failed. Please try again.");
        setFormData({ password: "" });
      }
    } else {
      console.log("Form validation failed");
      toast.error("Please correct the errors in the form.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    console.log("Password visibility toggled");
  };

  console.log("Rendering UpdatePassword component", { loading, error });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md sm:max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Update Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your new password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    placeholder="*********"
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full pr-10"
                    onChange={handleChange}
                    value={formData.password}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>
            </div>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Updating Password..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default UpdatePassword;
