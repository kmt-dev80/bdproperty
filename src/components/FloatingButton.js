import React from 'react';
import { Button } from 'react-bootstrap';
import { useModal } from '../context/ModalContext';

const FloatingButton = () => {
  const { setShowListPropertyModal } = useModal();

  return (
    <Button
      variant="warning"
      className="floating-button"
      onClick={() => setShowListPropertyModal(true)}
      title="List a Property"
    >
      <i className="fas fa-plus fs-4"></i>
    </Button>
  );
};

export default FloatingButton;