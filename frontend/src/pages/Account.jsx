import { useState } from "react";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Alert from "../components/Alert.jsx";

export default function Account() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  if (user) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await (mode === "login" ? login({ email, password }) : register({ name, email, password }));
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="account-page">
      <div className="account-aside"><div className="account-aside-inner"><span className="brand-mark"><ShieldCheck size={23} /></span><span className="section-kicker">YOUR SECURITY JOURNEY</span><h1>Build awareness<br />that <span>stays with you.</span></h1><p>Your practice history and recommended lessons are saved to your private learning account.</p><div className="aside-points"><span><ShieldCheck size={17} /> Progress that persists</span><span><LockKeyhole size={17} /> Secure sign-in</span></div></div></div>
      <div className="account-form-wrap"><form className="account-form" onSubmit={handleSubmit}>
        <span className="section-kicker">{mode === "login" ? "WELCOME BACK" : "GET STARTED"}</span>
        <h2>{mode === "login" ? "Sign in to your account" : "Create your account"}</h2>
        <p>{mode === "login" ? "Pick up where you left off." : "Save your progress and get personal recommendations."}</p>
        {error && <Alert>{error}</Alert>}
        {mode === "register" && <label>Your name<input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} minLength="2" maxLength="60" required /></label>}
        <label>Email address<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} maxLength="254" required /></label>
        <label>Password<input type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} minLength={mode === "register" ? 10 : 1} maxLength="128" required />{mode === "register" && <small>Use at least 10 characters.</small>}</label>
        <button className="button button-primary button-full" disabled={busy}>{busy ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"} {!busy && <ArrowRight size={17} />}</button>
        <div className="auth-switch">{mode === "login" ? "New here?" : "Already have an account?"} <button type="button" className="text-button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}> {mode === "login" ? "Create an account" : "Sign in"}</button></div>
        <div className="privacy-note"><LockKeyhole size={15} /> Never use a real password in the practice emails.</div>
        <Link className="back-home" to="/">← Back to home</Link>
      </form></div>
    </main>
  );
}
