import React from 'react';
import { 
    BrowserRouter, 
    Routes, 
    Route, 
    Navigate,
    createRoutesFromElements,
    createBrowserRouter,
    RouterProvider
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
import { ThemeProvider, useTheme } from './context/ThemeContext';
import TopNavbar from './components/TopNavbar';

// Layout component for dashboard
const DashboardLayout = ({ children }) => {
  const { theme } = useTheme();
  return (
    <div className={`flex min-h-screen ${
      theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-gray-800'
    }`}>
      <NavBar />
      <div className='flex-1'>
        <TopNavbar />
        <div className='p-4 mt-16'>
          {children}
        </div>
      </div>
    </div>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
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

      <Route path="/hero-text-edit" element={
        <ProtectedRoute>
          <DashboardLayout>
            <HeroTextEdit />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/edit-modal" element={
        <ProtectedRoute>
          <DashboardLayout>
            <ModalEdit />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/create-new" element={
        <ProtectedRoute>
          <DashboardLayout>
            <CreateNew />
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
    </Route>
  ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true
    },
    basename: '/'
  }
);

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
