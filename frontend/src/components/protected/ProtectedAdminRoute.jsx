import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProtectedAdminRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);  // Check if user is logged in
  const user = useSelector((state) => state.auth.user);              // Access user object from auth state
  const toastShownRef = useRef(false);                               // Ref to track if toast has been shown

  useEffect(() => {
    // Show toast message if user is not logged in or not an admin, and toast hasn't been shown
    if ((!isLoggedIn || user?.role !== 'Admin') && !toastShownRef.current) {
      toast.error("This Route is Protected. Admin access only!");  // Show toast
      toastShownRef.current = true;       // Mark toast as shown
    }
  }, [isLoggedIn, user]);

  // If not logged in or not an admin, redirect to login page
  if (!isLoggedIn || user?.role !== 'Admin') {
    return <Navigate to="/" replace />; // Redirect non-admins or logged out users to home page
  }

  // If user is logged in and is an admin, render the child components
  return children;
};

export default ProtectedAdminRoute;
