import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AnaSayfa from './components/AnaSayfa';
import Login from './components/login.js';
import Calendar  from './components/Calendar.js';
import ForgotPasswordForm from './components/forgotPasswordForm';


const App = () => {
  return (
    
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<AnaSayfa />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/calendar" element={<Calendar/>} />
          
      
        </Routes>
      </Router>

  );
};

export default App;
