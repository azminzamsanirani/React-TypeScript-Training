// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Components/Header';
import Landing from './Components/Landing';
import Register from './Components/Register';
import Login from './Components/Login';
import CountriesTable from './App/CountryCurrency/components/CountriesTable';
import CalendarComponent from './App/Calendar/Components/Calendar';
import MachineUtilization from './App/MachineUtilization/Components/MachineUtilization';
import Chat from './App/Chat/Components/Chat';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/landing" element={<Landing />} />
          <Route path="/register" element={<Register onNewUser={() => {}} />} />
          <Route path="/currency" element={<CountriesTable />} />
          <Route path="/calendar" element={<CalendarComponent/>} />
          <Route path="/machine" element={<MachineUtilization/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
