function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sports Platform</h3>
            <p className="text-gray-600 text-sm">
              Connecting players and facilities for a better sports experience.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">For Players</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-gray-900">
                  Find Facilities
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  Join Lobbies
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  Book Courts
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">For Owners</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-gray-900">
                  List Facility
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  Manage Bookings
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  Analytics
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            © 2024 Sports Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
