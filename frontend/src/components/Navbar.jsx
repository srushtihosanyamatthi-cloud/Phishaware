import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, ShieldCheck, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function signOut() {
    logout();
    setOpen(false);
    navigate("/");
  }

  const linkClass = ({ isActive }) => `nav-link${isActive ? " active" : ""}`;
  const closeMenu = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link className="brand" to="/" onClick={closeMenu}>
          <span className="brand-mark"><ShieldCheck size={21} /></span>
          <span>phish<span className="brand-accent">aware</span></span>
        </Link>
        <button className="icon-button mobile-menu" type="button" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav className={`main-nav${open ? " nav-open" : ""}`}>
          <NavLink className={linkClass} to="/" onClick={closeMenu}>Home</NavLink>
          <NavLink className={linkClass} to="/learn" onClick={closeMenu}>Learn</NavLink>
          {user ? (
            <>
              <NavLink className={linkClass} to="/dashboard" onClick={closeMenu}>Dashboard</NavLink>
              <button className="button button-outline nav-account" type="button" onClick={signOut}>Sign out</button>
            </>
          ) : (
            <Link className="button button-outline nav-account" to="/account" onClick={closeMenu}>Sign in</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
