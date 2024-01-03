import React, { createContext, useState, useEffect, ReactNode } from "react";

// Define the User interface
interface User {
  _id?: string;
  email?: string;
  isLoggedIn: boolean;
  name?: string;
  password?: string;
  profilephoto?: {
    type: string;
  };
  username?: string;
  __v?: number;
}

// Define the AuthContextProps interface
export interface AuthContextProps {
  isLoggedIn: boolean;
  name?:string;
  _id?: string;
  email?: string;
  password?: string;
  profilephoto?: {
    type: string;
  };
  username?: string;
  __v?: number;
  login: (retrievedUserData: User) => void;
  logout: () => void;
  
}

// Create the AuthContext with initial undefined value
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Define the AuthProviderProps interface
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize user state with default values
  const [user, setUser] = useState<User>({
    _id: "",
    email: "",
    isLoggedIn: false,
    name: "",
    password: "",
    profilephoto: { type: "", /* Add other properties for profilephoto */ },
    username: "",
    __v: 0,
  });

  // Read user data from local storage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function
  const login = (retrievedUserData: User) => {
    setUser({ ...retrievedUserData, isLoggedIn: true });

    // Storing data in localStorage
    localStorage.setItem(
      "user",
      JSON.stringify({ ...retrievedUserData, isLoggedIn: true })
    );
  };

  // Logout function
  const logout = () => {
    setUser({
      _id: "",
      email: "",
      isLoggedIn: false,
      name: "",
      password: "",
      profilephoto: { type: "", /* Add other properties for profilephoto */ },
      username: "",
      __v: 0,
    });

    // Storing data in localStorage
    localStorage.removeItem("user");
  };

  // Provide the AuthContext value to the components
  return (
    <AuthContext.Provider value={{ ...user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export AuthContext and AuthProvider
export { AuthContext, AuthProvider };
