// src/components/auth/FacilityOwnerRoute.jsx
import ProtectedRoute from './ProtectedRoute';

function FacilityOwnerRoute({ children }) {
  return <ProtectedRoute requiredRole="facility_owner">{children}</ProtectedRoute>;
}

export default FacilityOwnerRoute;
