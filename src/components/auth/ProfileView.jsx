// src/components/auth/ProfileView.jsx
import { Card } from '../common';

function ProfileView({ user, onEdit }) {
  const formatDate = date => {
    if (!date) return 'Not provided';
    return new Date(date).toLocaleDateString();
  };

  const getRoleDisplayName = role => {
    switch (role) {
      case 'facility_owner':
        return 'Facility Owner';
      case 'player':
        return 'Player';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card padding="p-6">
      <div className="flex items-start justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Profile Information</h2>
        <button onClick={onEdit} className="text-primary-600 hover:text-primary-700 font-medium">
          Edit Profile
        </button>
      </div>

      <div className="space-y-6">
        {/* Profile Photo */}
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {user.profilePhotoUrl || user.profile_photo_url ? (
              <img
                src={user.profilePhotoUrl || user.profile_photo_url}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={e => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">{user.fullName || user.full_name}</h3>
            <p className="text-sm text-gray-500">{getRoleDisplayName(user.role)}</p>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <p className="text-gray-900">{user.fullName || user.full_name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <p className="text-gray-900">{user.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
            <p className="text-gray-900">{getRoleDisplayName(user.role)}</p>
          </div>

          {/* Role-specific fields */}
          {user.role === 'player' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <p className="text-gray-900">{formatDate(user.dateOfBirth || user.date_of_birth)}</p>
            </div>
          )}

          {user.role === 'facility_owner' && user.phone && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <p className="text-gray-900">{user.phone}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
            <p className="text-gray-900">
              {formatDate(user.createdAt || user.created_at || new Date())}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ProfileView;
