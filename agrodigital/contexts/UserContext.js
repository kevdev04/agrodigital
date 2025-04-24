import React, { createContext, useState, useContext } from 'react';

// Create the context
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    fullName: '',
    phone: '',
    address: '',
    birthState: '',
    birthDate: '',
    gender: '',
    email: '',
    curp: '',
    rfc: ''
  });

  const updateUserData = (newData) => {
    setUserData(prevData => ({ ...prevData, ...newData }));
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => useContext(UserContext); 