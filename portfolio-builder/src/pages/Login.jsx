import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <main className="page-center">
        <section className="card auth-card">
          <h2 className="mb-3">Login</h2>
          <form className="form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <div className="form-row">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" placeholder="you@example.com" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-row">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" placeholder="••••••••" onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="form-footer">
              <button type="submit" className="btn btn-block">Log In</button>
            </div>
          </form>
          <p className="text-muted mt-3">No account? <Link to="/signup">Sign Up</Link></p>
        </section>
      </main>
    </>
  );
}
