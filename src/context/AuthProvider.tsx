import React, { createContext, useContext, useEffect, useState } from "react";
import { IUser } from "@delatte/shared/interfaces"; // Importa la interfaz IUser desde tu paquete compartido

// Definición del tipo para el contexto de autenticación
interface AuthContextType {
  user: IUser | null; // Usa la interfaz IUser para tipar el usuario
  login: (userData: IUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// Crear el contexto de autenticación
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

// Componente proveedor de autenticación
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null); // Estado del usuario
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticación

  // Cargar el estado de autenticación desde localStorage al inicializar
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  // Función para iniciar sesión
  const login = (userData: IUser) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData)); // Guardar usuario en localStorage
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user"); // Eliminar usuario de localStorage
  };

  // Valor del contexto que se proporcionará a los componentes hijos
  const value = {
    user,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};