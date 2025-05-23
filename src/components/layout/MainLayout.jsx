import Navbar from './Navbar';
import Footer from './Footer';

function MainLayout({ children, showFooter = true }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}

export default MainLayout;
