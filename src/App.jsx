import React from 'react';
import { 
    BrowserRouter, 
    Routes, 
    Route, 
    Navigate
} from 'react-router-dom';
import NavBar from './components/NavBar';
import EditHeader from './components/EditHeader';
import BannerEdit from './components/BannerEdit';
import HeroTextEdit from './components/HeroTextEdit';
import ModalEdit from './components/ModalEdit';
import CreateNew from './components/CreateNew';
import EditFooter from './components/EditFooter';
import Register from './components/Register';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AdminAccounts from './components/AdminAccounts';
import EnquiryList from './components/EnquiryList';

// Layout component for dashboard
const DashboardLayout = ({ children }) => (
  <div className='flex h-screen bg-slate-900 text-white'>
    <NavBar />
    <div className='flex-1 p-4'>
      {children}
    </div>
  </div>
);

function App() {
  const handleSave = () => {
    console.log("Data saved successfully!");
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Navigate to="/edit-header" replace />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/edit-header" element={
          <ProtectedRoute>
            <DashboardLayout>
              <EditHeader />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/banner-edit" element={
          <ProtectedRoute>
            <DashboardLayout>
              <BannerEdit />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/Hero-Text-edit" element={
          <ProtectedRoute>
            <DashboardLayout>
              <HeroTextEdit />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/Edit-modal" element={
          <ProtectedRoute>
            <DashboardLayout>
              <ModalEdit onSave={handleSave} />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/create-new" element={
          <ProtectedRoute>
            <DashboardLayout>
              <CreateNew onSave={handleSave} onClose={() => {}} />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/edit-footer" element={
          <ProtectedRoute>
            <DashboardLayout>
              <EditFooter />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin-accounts" element={
          <ProtectedRoute>
            <DashboardLayout>
              <AdminAccounts />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/enquiries" element={
          <ProtectedRoute>
            <DashboardLayout>
              <EnquiryList />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Catch all route - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;