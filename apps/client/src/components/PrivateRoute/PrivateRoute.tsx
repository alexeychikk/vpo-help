import { Navigate } from 'react-router-dom';

export type PrivateRouteProps = {
  getToken: () => string | null;
  redirectPath: string;
  element: React.ReactElement;
};

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  getToken,
  redirectPath,
  element,
}) => {
  if (!getToken()) {
    return <Navigate to={redirectPath} replace />;
  }
  return element;
};
