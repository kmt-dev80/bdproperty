import React, { createContext, useState, useContext } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showListPropertyModal, setShowListPropertyModal] = useState(false);
  
  return (
    <ModalContext.Provider value={{ 
      showLoginModal, 
      setShowLoginModal,
      showRegisterModal, 
      setShowRegisterModal,
      showListPropertyModal, 
      setShowListPropertyModal
    }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);