import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import tokenService from '../services/token'

const AdminProtectedRoute = ({ element }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const checkAuthorization = async () => {
      const authorized = await tokenService.isTokenValidAdmin();
      setIsAuthorized(authorized);
    };

    checkAuthorization();
  }, []);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  return element || <Outlet />;
};

export default AdminProtectedRoute