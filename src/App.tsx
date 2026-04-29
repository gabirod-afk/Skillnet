import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts y Protecciones
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Páginas Públicas
import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Páginas Privadas
import Marketplace from './pages/products/Marketplace';
import CourseDetailsPage from './pages/products/CourseDetailsPage';
import CategoryCatalogPage from './pages/products/CategoryCatalogPage';
import CartPage from './pages/products/CartPage';
import CheckoutPage from './pages/payments/CheckoutPage';
import ProfileSettings from './pages/affiliate/ProfileSettings';
import CreateProductFlow from './pages/producer/CreateProductFlow';
import MyProducts from './pages/producer/MyProducts'; 

// Páginas de Administrador (NUEVAS IMPORTACIONES)
import DashboardAdmin from './pages/admin/DashboardAdmin';
import UserManagement from './pages/admin/UserManagement';
import CourseManagement from './pages/admin/CourseManagement';
import ProducerServices from './pages/admin/ProducerServices';
import TutorVerification from './pages/admin/TutorVerification';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <MainLayout>
            <Routes>
            
            {/* ==============================
                RUTAS PÚBLICAS
            ============================== */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/catalog/:categoryId" element={<CategoryCatalogPage />} />

            {/* ==============================
                RUTAS PRIVADAS GENERALES (Para todos los logueados)
            ============================== */}
            <Route 
              path="/marketplace" 
              element={<ProtectedRoute><Marketplace /></ProtectedRoute>} 
            />
            <Route
              path="/marketplace/course/:courseId"
              element={<ProtectedRoute><CourseDetailsPage /></ProtectedRoute>}
            />
            <Route
              path="/checkout"
              element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>}
            />
            <Route
              path="/cart"
              element={<ProtectedRoute><CartPage /></ProtectedRoute>}
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
                <RoleProtectedRoute allowedRoles={['afiliado', 'infoproductor', 'admin']}>
                  <CreateProductFlow />
                </RoleProtectedRoute>
              } 
            />

            <Route
              path="/mis-productos"
              element={
                <RoleProtectedRoute allowedRoles={['afiliado', 'infoproductor', 'admin']}>
                  <MyProducts />
                </RoleProtectedRoute>
              }
            />

            {/* ==============================
                RUTAS DE ADMINISTRADOR
            ============================== */}
            <Route
              path="/admin/dashboard"
              element={
                <RoleProtectedRoute allowedRoles={['admin']}>
                  <DashboardAdmin />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin/usuarios"
              element={
                <RoleProtectedRoute allowedRoles={['admin']}>
                  <UserManagement />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin/cursos"
              element={
                <RoleProtectedRoute allowedRoles={['admin']}>
                  <CourseManagement />
                </RoleProtectedRoute>
              }
            />
            <Route path="/admin/servicios" element={<RoleProtectedRoute allowedRoles={['admin']}><ProducerServices /></RoleProtectedRoute>} />
            <Route path="/admin/verificacion" element={<RoleProtectedRoute allowedRoles={['admin']}><TutorVerification /></RoleProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </MainLayout>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;