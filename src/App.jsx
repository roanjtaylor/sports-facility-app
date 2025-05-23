// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './contexts/AuthContext';
import { routes } from './routes';
import ProtectedRoute from './components/auth/ProtectedRoute';
import FacilityOwnerRoute from './components/auth/FacilityOwnerRoute';
import PlayerRoute from './components/auth/PlayerRoute';
import Spinner from './components/common/Spinner';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Suspense fallback={<Spinner />}>
            <Routes>
              {/* Public routes */}
              {routes.public.map(({ path, element: Component }) => (
                <Route key={path} path={path} element={<Component />} />
              ))}

              {/* Facility owner protected routes */}
              {routes.facilityOwner.map(({ path, element: Component }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <FacilityOwnerRoute>
                      <Component />
                    </FacilityOwnerRoute>
                  }
                />
              ))}

              {/* Player protected routes */}
              {routes.player.map(({ path, element: Component }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <PlayerRoute>
                      <Component />
                    </PlayerRoute>
                  }
                />
              ))}

              {/* 404 route */}
              <Route path={routes.notFound.path} element={<routes.notFound.element />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
      {/* Add React Query DevTools in development */}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
