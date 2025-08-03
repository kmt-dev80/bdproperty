// App.js
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/Prodetails';
import Services from './pages/Services';
import Agents from './pages/Agents';
import Contact from './pages/Contact';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/properties" element={<Properties />} />
      <Route path="/prodetails" element={<PropertyDetails />} />
      <Route path="/services" element={<Services />} />
      <Route path="/agents" element={<Agents />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}

export default App;
