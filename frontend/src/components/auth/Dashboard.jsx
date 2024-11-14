import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../../redux/slices/authSlice"; // Adjust path as needed
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming you have these Card components

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user, error, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  return (
    <div className="flex justify-center ">
      {loading ? (
        <div className="text-center text-gray-600 text-xl">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 text-xl">{error}</div>
      ) : user ? (
        <Card className="w-full max-w-lg bg-white shadow-md rounded-lg p-4">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Welcome
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-gray-800">
              {`Welcome ${user.name}, we are glad to have you as a ${user.role}.`}
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

export default Dashboard;
