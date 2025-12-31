import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import AppLayout from './components/layouts/AppLayout';
import LandingPage from './pages/LandingPage';
import Onboarding from './pages/Onboarding';
import JobListing from './pages/JobListing';
import JobPage from './pages/JobPage';
import PostJob from './pages/PostJob';
import SavedJobs from './pages/SavedJobs';
import MyJobs from './pages/MyJobs';
import { ThemeProvider } from "@/components/dark-mode/theme-provider"
import ProtectedRoute from './components/protected/ProtectedRoute';
import { ToastContainer } from 'react-toastify'

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: '/onboarding',
        element:
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
      },
      {
        path: '/jobs',
        element:
          <ProtectedRoute>
            <JobListing />
          </ProtectedRoute>
      },
      {
        path: '/job/:id',
        element:
          <ProtectedRoute>
            <JobPage />
          </ProtectedRoute>
      },
      {
        path: '/post-job',
        element:
          <ProtectedRoute>
            <PostJob />
          </ProtectedRoute>
      },
      {
        path: '/saved-jobs',
        element:
          <ProtectedRoute>
            <SavedJobs />
          </ProtectedRoute>
      },
      {
        path: '/my-jobs',
        element:
          <ProtectedRoute>
            <MyJobs />
          </ProtectedRoute>
      },
    ]
  }
]);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </ThemeProvider>
  )
}

export default App
