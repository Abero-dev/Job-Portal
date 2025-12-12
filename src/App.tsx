import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from './components/layouts/AppLayout';
import LandingPage from './pages/LandingPage';
import Onboarding from './pages/Onboarding';
import JobListing from './pages/JobListing';
import JobPage from './pages/JobPage';
import PostJob from './pages/PostJob';
import SavedJob from './pages/SavedJob';
import MyJobs from './pages/MyJobs';

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
        element: <Onboarding />
      },
      {
        path: '/jobs',
        element: <JobListing />
      },
      {
        path: '/job/:id',
        element: <JobPage />
      },
      {
        path: '/post-job',
        element: <PostJob />
      },
      {
        path: '/saved-job',
        element: <SavedJob />
      },
      {
        path: '/my-jobs',
        element: <MyJobs />
      },
    ]
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
