import React from "react";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import Welcome from "./pages/Welcome";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="App">
        <Welcome />
      </div>
    </AuthProvider>
  );
};

export default App;
