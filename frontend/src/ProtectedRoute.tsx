import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }: { element: React.ReactElement }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userType, setUserType] = useState<"spotify" | "nonspotify" | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}backend/independentCookieAuth.php`, {
          method: "GET",
          credentials: "include",
        });

        const result = await response.json();

        if (result.status === "success") {
          setIsAuthenticated(true);
          setUserType(result.spotify_id ? "spotify" : "nonspotify");
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
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Redirect based on user type if accessing the base /song route
  if (window.location.hash.includes("#/song")) {
    return userType === "spotify"
      ? <Navigate to="/song" />
      : <Navigate to="/song-nonspotify" />;
  }

  return element;
};

export default ProtectedRoute;
