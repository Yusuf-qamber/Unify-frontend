import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState } from "react";
import "./NavBar.scss";

const NavBar = ({ user, handleSignOut }) => {
  const { college } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <Link to="/">Unify</Link>
      </div>

      {/* Hamburger toggle for small screens */}
      <button
        className="navbar__toggle"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      <ul className={`navbar__menu ${menuOpen ? "show" : ""}`}>
        {user ? (
          <>
            <li><Link to="/schedule">My Schedule</Link></li>
            <li><Link to="/assignments">Assignments</Link></li>
            <li><Link to="/gpa">GPA Calculator</Link></li>
            {/* <li className="navbar__welcome">Hi, {user.username}</li> */}
            <li className="navbar__welcome"><Link to="/profile">Hi, {user.username}</Link></li>
            <li><Link to="/">Home</Link></li>
            <li>
              <Link to="/" onClick={handleSignOut}>
                Sign Out
              </Link>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/sign-up">Sign Up</Link></li>
            <li><Link to="/sign-in">Sign In</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
