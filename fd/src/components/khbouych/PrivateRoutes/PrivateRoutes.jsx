
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../UserContext/Context";
import { useContext } from "react";
import Spinner from "./spinner";

function PrivateRoutes() {
  const { user, Userstate } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserState = async () => {
      await Userstate();
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    };

    fetchUserState();
  }, [user, Userstate]);

  if (loading) {
    return <Spinner />; // Optionally show a loading spinner or message
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoutes;
