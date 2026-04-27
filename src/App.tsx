import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts y Protecciones
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
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
                RUTAS PRIVADAS GENERALES (Para todos los logueados)
            ============================== */}
            <Route 
              path="/marketplace" 
              element={<ProtectedRoute><Marketplace /></ProtectedRoute>} 
            />
            
            <Route 
              path="/profile" 
              element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} 
            />
            
            {/* ==============================
                RUTAS DE CREADOR (Solo Afiliados e Infoproductores)
            ============================== */}
            <Route 
              path="/crear-producto" 
              element={
                <RoleProtectedRoute allowedRoles={['afiliado', 'infoproductor']}>
                  <CreateProductFlow />
                </RoleProtectedRoute>
              } 
            />

            <Route
              path="/mis-productos"
              element={
                <RoleProtectedRoute allowedRoles={['afiliado', 'infoproductor']}>
                  <MyProducts />
                </RoleProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </MainLayout>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;