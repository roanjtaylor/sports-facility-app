function Landing() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Sports Facility Platform</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border rounded shadow-sm">
          <h2 className="text-xl font-semibold mb-4">For Facility Owners</h2>
          <p className="mb-4">Manage your sports facilities effortlessly</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Get Started</button>
        </div>
        <div className="p-6 border rounded shadow-sm">
          <h2 className="text-xl font-semibold mb-4">For Players</h2>
          <p className="mb-4">Find and book sports facilities easily</p>
          <button className="bg-green-500 text-white px-4 py-2 rounded">Find Games</button>
        </div>
      </div>
    </div>
  );
}

export default Landing;
