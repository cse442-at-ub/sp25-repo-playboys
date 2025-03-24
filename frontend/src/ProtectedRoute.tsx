import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }: { element: React.ReactElement }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}independentCookieAuth.php`, {
          method: "GET",
          credentials: "include", // Sends cookies with request
        });

        const result = await response.json();

        if (result.status === "success") {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error authenticating user:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Show a loading state while checking auth
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
