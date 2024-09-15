import { Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { authContext } from '../Context/Context';

const PrivateRoute = ({ component: Component, ...rest }) => {

  const {token,setToken} = useContext(authContext);
  setToken("true")
  return (
    <Route
      {...rest}
      render={props =>
        token ? (
          <Component {...props} />
        ) : (
          <Navigate to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;