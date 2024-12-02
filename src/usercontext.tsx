import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextProps {
  isLoggedIn: boolean;
  username: string | null;
  logIn: (username: string) => void;
  logOut: () => void;
}

// Default values
const UserContext = createContext<UserContextProps>({
  isLoggedIn: false,
  username: null,
  logIn: () => {},
  logOut: () => {},
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const logIn = (username: string) => {
    setIsLoggedIn(true);
    setUsername(username);
  };

  const logOut = () => {
    setIsLoggedIn(false);
    setUsername(null);
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, username, logIn, logOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
