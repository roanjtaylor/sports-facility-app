// src/components/auth/UserTypeSelection.jsx
import { Card, Button } from '../common';

function UserTypeSelection({ onSelectType }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Account Type</h2>
        <p className="text-lg text-gray-600">
          Select the option that best describes how you'll use our platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card padding="p-8" hover className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Facility Owner</h3>
            <p className="text-gray-600 mb-6">
              I own or manage sports facilities and want to list them on the platform to maximize
              bookings and manage operations efficiently.
            </p>
            <ul className="text-sm text-gray-500 space-y-2 mb-6">
              <li>• List and manage facilities</li>
              <li>• Handle booking requests</li>
              <li>• Set pricing and availability</li>
              <li>• View analytics and reports</li>
            </ul>
          </div>
          <Button className="w-full" onClick={() => onSelectType('facility_owner')}>
            I'm a Facility Owner
          </Button>
        </Card>

        <Card padding="p-8" hover className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-secondary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Player</h3>
            <p className="text-gray-600 mb-6">
              I want to find and book sports facilities, join games with other players, and organize
              matches easily.
            </p>
            <ul className="text-sm text-gray-500 space-y-2 mb-6">
              <li>• Discover facilities</li>
              <li>• Book courts and pitches</li>
              <li>• Join or create lobbies</li>
              <li>• Connect with other players</li>
            </ul>
          </div>
          <Button variant="secondary" className="w-full" onClick={() => onSelectType('player')}>
            I'm a Player
          </Button>
        </Card>
      </div>
    </div>
  );
}

export default UserTypeSelection;
