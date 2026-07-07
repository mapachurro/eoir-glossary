import { Link, NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="site-title">
            <span>Immigration Glossary</span>
            <span>Glosario de lo migratorio</span>
          </Link>

          <nav className="site-nav">
            <div className="site-nav__row">
              <NavLink to="/" end>
                Home
              </NavLink>
              <NavLink to="/terms">All Terms</NavLink>
              <NavLink to="/forms">Forms</NavLink>
              <NavLink to="/legal-authority">Authority</NavLink>
            </div>

            <div className="site-nav__row">
              <NavLink to="/sources">Bibliography & Sources</NavLink>
              <NavLink to="/submissions">Submissions & Revisions</NavLink>
            </div>
          </nav>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>
    </div>
  );
}
