import './App.css'
import Home from './pages/Home/Home';
import Login from './pages/Login_new';
import Dashboard from './pages/Dashboard/Dashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}
export default App