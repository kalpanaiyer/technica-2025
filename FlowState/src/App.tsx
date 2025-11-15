import './App.css'
import Home from './pages/Home';
import Login from './pages/Login_new'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}
export default App