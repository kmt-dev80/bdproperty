import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'animate.css/animate.min.css';
import './assets/css/style.css';
import './App.css';
//import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Header from './components/Header';
import App from './App';
import Footer from './components/Footer';
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
        <Header />
        <App />
        <Footer />
        <FloatingButton />
        <ModalContainer />
      </ModalProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();