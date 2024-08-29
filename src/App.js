import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  const [registeredFaces, setRegisteredFaces] = useState([]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="p-4 bg-white shadow">
          <Link to="/" className="mr-4">Register</Link>
          <Link to="/login">Login</Link>
        </nav>
        <Routes>
          <Route
            path="/"
            element={<Register registeredFaces={registeredFaces} setRegisteredFaces={setRegisteredFaces} />}
          />
          <Route path="/login" element={<Login registeredFaces={registeredFaces} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

