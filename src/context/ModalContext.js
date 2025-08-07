import React, { createContext, useState, useContext } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showListPropertyModal, setShowListPropertyModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

   const openListPropertyModal = (property = null) => {
    setEditingProperty(property);
    setShowListPropertyModal(true);
  };
  
  const closeListPropertyModal = () => {
    setEditingProperty(null);
    setShowListPropertyModal(false);
  };
  
  return (
    <ModalContext.Provider value={{ 
      showLoginModal, 
      setShowLoginModal,
      showRegisterModal, 
      setShowRegisterModal,
      showListPropertyModal, 
      setShowListPropertyModal,
      editingProperty,
      setEditingProperty,
      openListPropertyModal,
      closeListPropertyModal
    }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);