// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { routes } from './routes';
import ProtectedRoute from './components/auth/ProtectedRoute';
import FacilityOwnerRoute from './components/auth/FacilityOwnerRoute';
import PlayerRoute from './components/auth/PlayerRoute';
import Spinner from './components/common/Spinner';

function App() {
  return (
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
  );
}

export default App;
