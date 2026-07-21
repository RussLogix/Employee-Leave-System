import { useAuth } from "../context/AuthContext";

function Layout({ title, subtitle, children }) {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="brand">LeaveFlow</p>
          <p className="topbar-user">
            {user?.name} · {user?.role}
          </p>
        </div>

        <button
          className="button button-secondary"
          onClick={logout}
        >
          Log Out
        </button>
      </header>

      <main className="dashboard">
        <section className="page-heading">
          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
        </section>

        {children}
      </main>
    </div>
  );
}

export default Layout;