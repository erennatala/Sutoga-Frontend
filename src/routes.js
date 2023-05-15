import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import Home from './pages/Home';
import Profile from './pages/Profile';
import RegisterPage from "./pages/RegisterPage";
import Games from "./pages/Games";
import Messages from "./pages/Messages";
import ProtectedRoute from './pages/ProtectedRoute';
import LoadingScreen from "./pages/LoadingScreen";
import PostPage from "./pages/PostDetailCard"
// ----------------------------------------------------------------------

export default function Router({ isLoading, isAuthenticated }) {
  if (isLoading) {
    return <LoadingScreen />;
  }
  const routes = useRoutes([
    {
      path: '/',
      element: isAuthenticated ? <DashboardLayout/> : <Navigate to="/login" />,
      children: [
        {
          element: isAuthenticated ? (
              <Navigate to="/home" />
          ) : (
              <Navigate to="/login" />
          ),
          index: true,
        },
        { path: 'app', element: <ProtectedRoute><DashboardAppPage /></ProtectedRoute> },
        { path: 'user', element: <ProtectedRoute><UserPage /></ProtectedRoute> },
        { path: 'products', element: <ProtectedRoute><ProductsPage /></ProtectedRoute> },
        { path: 'blog', element: <ProtectedRoute><BlogPage /></ProtectedRoute> },
        { path: 'home', element: <ProtectedRoute><Home /></ProtectedRoute> },
        { path: 'profile', element: <ProtectedRoute><Profile /></ProtectedRoute> },
        { path: 'games', element: <ProtectedRoute><Games /></ProtectedRoute> },
        { path: 'messages', element: <ProtectedRoute><Messages /></ProtectedRoute> },
        { path: 'post/:postId', element: <ProtectedRoute><PostPage /></ProtectedRoute> }
      ],
    },
    {
      path: 'login',
      element: isAuthenticated ? <Navigate to="/home" /> : <LoginPage />,
    },
    {
      path: 'register',
      element: isAuthenticated ? <Navigate to="/home" /> : <RegisterPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/login" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
