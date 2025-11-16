import './App.css'
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard.tsx';
import Login from './pages/Login_new'
import Store from './pages/Store';
import Profile from './pages/Profile.tsx';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/store" element={<Store />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}
export default App