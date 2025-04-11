import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

const Logout: React.FC = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return <button onClick={handleLogout}>Log Out</button>;
};

export default Logout;
