import React from "react";
import { Navigate } from "react-router-dom";
import Navbar from "./Navbar";

interface UserBasedRouterProps {
  children: React.ReactNode;
}

const UserBasedRouter: React.FC<UserBasedRouterProps> = ({ children }) => {
  const userType = localStorage.getItem("userType");
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  // Se não estiver autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver na rota raiz "/", redireciona baseado no tipo de usuário
  if (window.location.pathname === "/") {
    if (userType === "OWNER") {
      return <Navigate to="/owner" replace />;
    } else if (userType === "CLIENT") {
      return <Navigate to="/client" replace />;
    }
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default UserBasedRouter;
