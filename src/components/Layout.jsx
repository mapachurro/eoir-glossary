import { Link, NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="site-title">
            EOIR Glossary
          </Link>

          <nav className="site-nav">
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/terms">
              All Terms
            </NavLink>
            <NavLink to="/sources">
              Bibliography & Sources
            </NavLink>
            <NavLink to="/submissions">
              Submissions & Revisions
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>
    </div>
  );
}