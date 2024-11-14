import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgetPassword } from "@/redux/slices/authSlice";
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
import toast from "react-hot-toast";

const ForgotPass = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  console.log("Error object:", error);
  const [formData, setFormData] = useState({
    email: ""
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // Dispatch the login action with formData (plain object)
        const resultAction = await dispatch(forgetPassword(formData));

        // Check if login is successful
        if (forgetPassword.fulfilled.match(resultAction)) {
          toast.success("Password reset mail sent!");

          // Reset the form
          setFormData({
            email: "",
          });

        } else {
          // Show error toast from the payload if available
          const errorMessage =
            resultAction.payload || "Form Submission failed. Please try again.";
          toast.error(errorMessage);
        }
      } catch (error) {
        console.error("Form Submission error:", error);
        toast.error("Form Submission failed. Please try again.");
        setFormData({
          email: "",
        });
      }
    } else {
      toast.error("Please correct the errors in the form.");
    }
  };



  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md sm:max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  className="w-full"
                  onChange={handleChange}
                  value={formData.email}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
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
  )
}

export default ForgotPass