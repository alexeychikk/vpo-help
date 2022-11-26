import { Navigate } from 'react-router-dom';

export type PrivateRouteProps = {
  token: string | null;
  redirectPath: string;
  element: React.ReactElement;
};

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  token,
  redirectPath,
  element,
}) => {
  if (!token) {
    return <Navigate to={redirectPath} replace />;
  }
  return element;
};
