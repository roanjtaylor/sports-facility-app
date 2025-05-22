// src/components/auth/PlayerRoute.jsx
import ProtectedRoute from './ProtectedRoute';

function PlayerRoute({ children }) {
  return <ProtectedRoute requiredRole="player">{children}</ProtectedRoute>;
}

export default PlayerRoute;
