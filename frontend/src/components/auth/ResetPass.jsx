import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "@/redux/slices/authSlice";
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

const ResetPass = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { token, role } = useParams(); // Get the token from the URL
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.newPassword) {
      newErrors.newPassword = "New Password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const resultAction = await dispatch(resetPassword({ token, newPassword: formData.newPassword }));
        
        if (resetPassword.fulfilled.match(resultAction)) {
          toast.success("Password reset successful!");
          setFormData({ newPassword: "" });
            if(role === "Admin"){
              navigate("/");
            }else{
              navigate("/login/user");
            }
          // Redirect to login page after successful reset
        } else {
          const errorMessage = resultAction.payload || "Password reset failed. Please try again.";
          toast.error(errorMessage);
        }
      } catch (error) {
        console.error("Password reset error:", error);
        toast.error("Password reset failed. Please try again.");
        setFormData({ newPassword: "" });
      }
    } else {
      toast.error("Please correct the errors in the form.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md sm:max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Reset Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your new password to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    placeholder="*********"
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full pr-10"
                    onChange={handleChange}
                    value={formData.newPassword}
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
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                )}
              </div>
            </div>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Resetting Password..." : "Reset Password"}
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

export default ResetPass;
