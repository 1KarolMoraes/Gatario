import { createContext, useContext, useNavigate, useState } from 'react';

// Criando o contexto
const AuthContext = createContext();

// Hook para acessar facilmente
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [username, setUser] = useState(() => {
    const savedUser = localStorage.getItem('username');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('username', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('username');
  };

  return (
    <AuthContext.Provider value={{ username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
