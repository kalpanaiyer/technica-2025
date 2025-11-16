import './App.css'
import Home from './pages/Home/Home';
import Login from './pages/Login_new'
import Store from './pages/Store';
import Profile from './pages/Profile.tsx';
import Dashboard from './pages/Dashboard/Dashboard.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx';
import { AuthProvider } from './auth/AuthProvider.tsx';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/store"
              element={
                <ProtectedRoute>
                  <Store />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}
export default App