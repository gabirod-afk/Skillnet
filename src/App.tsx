import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts y Protecciones
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

// Páginas Públicas
import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Páginas Privadas
import Marketplace from './pages/products/Marketplace';
import ProfileSettings from './pages/affiliate/ProfileSettings';
import CreateProductFlow from './pages/producer/CreateProductFlow';
import MyProducts from './pages/producer/MyProducts'; 

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            
            {/* ==============================
                RUTAS PÚBLICAS
            ============================== */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />


            {/* ==============================
                RUTAS PRIVADAS (Requieren Login)
            ============================== */}
            <Route
              path="/marketplace"
              element={
                <ProtectedRoute>
                  <Marketplace />
                </ProtectedRoute>
              }
            />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfileSettings />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/crear-producto" 
              element={
                <ProtectedRoute>
                  <CreateProductFlow />
                </ProtectedRoute>
              } 
            />

            <Route path="*" element={<Navigate to="/" replace />} />
            <Route
              path="/mis-productos"
              element={
                <ProtectedRoute>
                  <MyProducts />
                </ProtectedRoute>
              }
            />

          </Routes>
        </MainLayout>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;