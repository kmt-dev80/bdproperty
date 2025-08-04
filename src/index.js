import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import FloatingButton from './components/FloatingButton';
import ModalContainer from './components/ModalContainer';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { ModalProvider } from './context/ModalContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ModalProvider>
        <App />
        <FloatingButton />
        <ModalContainer />
      </ModalProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();