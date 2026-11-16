import { ArrowRight, BookOpen, CheckCircle2, Fingerprint, MailWarning, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const features = [
  { icon: MailWarning, title: "Real-world signals", text: "Practice spotting suspicious senders, risky links, urgent language, and unexpected files." },
  { icon: Fingerprint, title: "Your learning, tailored", text: "See the warning signs you missed and get lessons chosen from your saved quiz results." },
  { icon: ShieldCheck, title: "Safe by design", text: "Learn with fictional emails and harmless example.test addresses. No simulated passwords are collected." },
];

export default function Home() {
  const { user } = useAuth();
  return (
    <>
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> BUILD YOUR SECURITY INSTINCTS</div>
            <h1>Pause. Look closer.<br /><span>Stay one step ahead.</span></h1>
            <p className="hero-lead">Learn to recognize phishing before it reaches your inbox. Practice with safe, fictional emails and get guidance built around what you need to learn.</p>
            <div className="hero-actions">
              <Link className="button button-primary button-large" to={user ? "/quiz" : "/account"}>
                {user ? "Start a quiz" : "Start learning"} <ArrowRight size={18} />
              </Link>
              <Link className="button button-ghost button-large" to="/learn"><BookOpen size={18} /> Learn about phishing</Link>
            </div>
            <div className="hero-note"><CheckCircle2 size={16} /> Beginner-friendly · Safe practice · Personalized lessons</div>
          </div>
          <div className="hero-visual" aria-label="Example fictional email warning">
            <div className="visual-glow" />
            <div className="mail-card">
              <div className="mail-top"><span className="mail-icon"><MailWarning size={18} /></span><span>MESSAGE REVIEW</span><span className="mail-dots">•••</span></div>
              <div className="mail-label">FROM</div>
              <div className="mail-sender">security-update@example.test <span className="risk-tag">UNVERIFIED</span></div>
              <div className="mail-rule" />
              <div className="mail-label">SUBJECT</div>
              <div className="mail-subject">Your account needs attention</div>
              <p className="mail-message">We noticed unusual activity. Verify your account within 24 hours to avoid interruption.</p>
              <div className="mail-link">account-check.example.test/verify <span>↗</span></div>
              <div className="signal-row"><span className="signal-icon">!</span><div><strong>Pause and verify</strong><small>Urgency + unfamiliar link = warning signs</small></div></div>
            </div>
            <div className="float-chip"><ShieldCheck size={16} /> Train your instincts</div>
          </div>
        </div>
        <div className="hero-bottom"><span>LEARN TO SPOT THE SIGNS</span><div><i /> Sender addresses <i /> Suspicious links <i /> Social engineering</div></div>
      </section>
      <section className="section features-section">
        <div className="section-heading"><span className="section-kicker">A SMARTER WAY TO LEARN</span><h2>Small practice. Stronger instincts.</h2><p>Understand the signals behind a suspicious message—and what to do next.</p></div>
        <div className="feature-grid">{features.map(({ icon: Icon, title, text }) => <article className="feature-card" key={title}><span className="feature-icon"><Icon size={21} /></span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>
      <section className="cta-band"><div><span className="section-kicker">READY WHEN YOU ARE</span><h2>Make the next click a confident one.</h2></div><Link className="button button-primary" to={user ? "/quiz" : "/account"}>Try a quiz <ArrowRight size={17} /></Link></section>
    </>
  );
}
