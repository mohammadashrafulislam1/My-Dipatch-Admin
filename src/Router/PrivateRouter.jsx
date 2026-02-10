import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../Components/useAuth";
import LoadingScreen from "../Components/LoadingScreen";

const PrivateRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  const location = useLocation();
  const [showRedirect, setShowRedirect] = useState(false);

  useEffect(() => {
    if (!loading && !admin) {
      toast.error("Please login as admin to access this page");
      setShowRedirect(true);
    }
  }, [admin, loading]);

  if (loading) {
    return <LoadingScreen/>;
  }

  if (admin) {
    return children;
  }

  if (showRedirect) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return null;
};

export default PrivateRoute;
