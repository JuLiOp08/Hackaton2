import { type ReactNode } from "react";
import { useNavigate } from "react-router";
import useToken from "../contexts/TokenContext";

type ProtectedRouteProps = {
  children: ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token } = useToken();
  const navigate = useNavigate();

  if (!token) {
    navigate("/");
  }

  return <>{children}</>;
}

export default ProtectedRoute;
