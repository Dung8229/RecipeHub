import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Sticky */}
      <header className="sticky top-0 z-50">
        <Header />
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-[74px] md:pt-[200px]">{children}</main>

      {/* Footer */}
      <footer className="mt-4">
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;