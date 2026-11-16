import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, BookOpen, ShieldCheck } from "lucide-react";
import { api } from "../services/api.js";
import Loading from "../components/Loading.jsx";
import Alert from "../components/Alert.jsx";

const iconMap = { at: "@", link: "↗", clock: "◷", lock: "⌑", file: "▤", people: "◎" };

export default function Learn() {
  const [lessons, setLessons] = useState([]);
  const [expanded, setExpanded] = useState("");
  const [details, setDetails] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  async function loadLessons() {
    setError("");
    setLoading(true);
    try {
      const data = await api("/lessons");
      setLessons(data.lessons);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { loadLessons(); }, []);

  async function toggleLesson(lesson) {
    if (expanded === lesson._id) {
      setExpanded("");
      return;
    }
    setExpanded(lesson._id);
    if (details[lesson._id]) return;
    try {
      const data = await api(`/lessons/${lesson._id}`);
      setDetails((previous) => ({ ...previous, [lesson._id]: data.lesson }));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return <main className="page-shell learn-page">
    <div className="learn-hero"><span className="learn-hero-icon"><ShieldCheck size={23} /></span><span className="section-kicker">THE PHISHING FIELD GUIDE</span><h1>Knowledge is your<br /><span>best first defense.</span></h1><p>Short, practical lessons to help you spot a suspicious message, pause before you click, and verify with confidence.</p></div>
    {error && <Alert onRetry={loadLessons}>{error}</Alert>}
    {loading ? <Loading label="Loading learning resources..." /> : <><div className="lesson-intro"><div><span className="section-kicker">LEARN AT YOUR OWN PACE</span><h2>Explore the warning signs</h2></div><span>{lessons.length} short lessons</span></div><div className="lesson-grid">{lessons.map((lesson, index) => {
      const isOpen = expanded === lesson._id;
      const detail = details[lesson._id];
      return <article className={`lesson-card${isOpen ? " lesson-open" : ""}`} key={lesson._id}><button className="lesson-toggle" type="button" aria-expanded={isOpen} onClick={() => toggleLesson(lesson)}><span className="lesson-number">{String(index + 1).padStart(2, "0")}</span><span className="lesson-symbol">{iconMap[lesson.icon] || <BookOpen size={19} />}</span><span className="lesson-title-wrap"><strong>{lesson.title}</strong><small>{lesson.description}</small></span><span className="lesson-chevron">{isOpen ? <ArrowUp size={18} /> : <ArrowDown size={18} />}</span></button>{isOpen && <div className="lesson-content">{detail ? <>{detail.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<div className="lesson-tags">{detail.relatedWarningSigns.map((sign) => <span key={sign}>{sign}</span>)}</div></> : <span className="detail-loading">Loading lesson...</span>}</div>}</article>;
    })}</div></>}
    <div className="safe-reminder"><ShieldCheck size={20} /><div><strong>When in doubt, verify another way.</strong><span>Use a trusted bookmark or a known contact method—not the link or phone number in a suspicious message.</span></div></div>
  </main>;
}
