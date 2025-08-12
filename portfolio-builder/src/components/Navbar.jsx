import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to={user ? "/dashboard" : "/"} className="navbar-brand">My Portfolio Builder</Link>
        <div className="navbar-actions">
          {!user ? (
            <>
              <Link to="/" className="text-muted">Login</Link>
              <Link to="/signup" className="btn btn-secondary">Sign Up</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-muted">Dashboard</Link>
              <button className="btn btn-secondary" onClick={handleLogout}>Log Out</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
