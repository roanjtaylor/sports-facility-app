function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          Sports Facility Platform
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="card p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">For Facility Owners</h2>
            <p className="mb-6 text-gray-600">Manage your sports facilities effortlessly</p>
            <button className="btn-primary w-full">Get Started</button>
          </div>
          <div className="card p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">For Players</h2>
            <p className="mb-6 text-gray-600">Find and book sports facilities easily</p>
            <button className="btn-secondary w-full">Find Games</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
