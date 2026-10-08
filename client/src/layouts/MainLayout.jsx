import Navbar from "../components/Navbar";

function MainLayout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        {children}
      </main>

      <footer className="app-footer">
        <div className="footer-container">
          <div>
            <strong>Campus Connect</strong>
            <p>
              Connecting students, communities, and campus opportunities.
            </p>
          </div>

          <p className="footer-copy">
            © {new Date().getFullYear()} Campus Connect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
