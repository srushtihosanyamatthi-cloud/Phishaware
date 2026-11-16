import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Account from "./pages/Account.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Quiz from "./pages/Quiz.jsx";
import Results from "./pages/Results.jsx";
import Learn from "./pages/Learn.jsx";

function NotFound() {
  return <main className="page-shell not-found"><span className="section-kicker">404 · NOT FOUND</span><h1>That page has gone missing.</h1><p>Let's get you back to safer ground.</p><a className="button button-primary" href="/">Back home</a></main>;
}

export default function App() {
  return <><Navbar /><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/account" element={<Account />} />
    <Route path="/learn" element={<Learn />} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
    <Route path="/results/:attemptId" element={<ProtectedRoute><Results /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes><footer className="site-footer"><span>© {new Date().getFullYear()} PhishAware</span><span>Learn safely. Think before you click.</span></footer></>;
}
