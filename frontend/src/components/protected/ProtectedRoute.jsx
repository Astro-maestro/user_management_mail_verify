import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast'; // Import react-hot-toast

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Access isLoggedIn from authSlice
  const toastShownRef = useRef(false); // Ref to track if toast has been shown

  useEffect(() => {
    // If the user is not logged in and toast hasn't been shown, show the toast message
    if (!isLoggedIn && !toastShownRef.current) {
      toast.error("This route is protected. Users only!");
      toastShownRef.current = true; // Mark that toast has been shown
    }
  }, [isLoggedIn]);

  // If user is not logged in, redirect to login page
  if (!isLoggedIn) {
    return <Navigate to="/user/login" replace />;
  }

  // If logged in, render the child components
  return children;
};

export default ProtectedRoute;
