import { useCallback, useEffect, useState } from "react";
import { ArrowRight, BookOpen, CircleHelp, Clock3, Crosshair, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../services/api.js";
import Loading from "../components/Loading.jsx";
import Alert from "../components/Alert.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [progress, lessons] = await Promise.all([
        api(`/progress/${user.id}`),
        api(`/progress/${user.id}/recommendations`),
      ]);
      setData(progress);
      setRecommendations(lessons.recommendations);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => { loadData(); }, [loadData]);
  if (loading) return <main className="page-shell"><Loading label="Loading your dashboard..." /></main>;
  if (error) return <main className="page-shell"><Alert onRetry={loadData}>{error}</Alert></main>;

  const stats = data.stats;
  const score = stats.latestScore;
  return (
    <main className="page-shell dashboard-page">
      <div className="page-heading dashboard-heading"><div><span className="section-kicker">YOUR LEARNING SPACE</span><h1>Good to see you, {user.name.split(" ")[0]}.</h1><p>Every message you practice makes the next one easier to read.</p></div><Link to="/quiz" className="button button-primary">Start a quiz <ArrowRight size={17} /></Link></div>
      <div className="stats-grid">
        <Stat icon={CircleHelp} label="Quizzes completed" value={stats.quizzesAttempted} hint="Keep up your practice" />
        <Stat icon={Target} label="Correct answers" value={stats.correctAnswers} hint={`${stats.totalQuestions} questions answered`} />
        <Stat icon={TrendingUp} label="Overall accuracy" value={`${stats.accuracy}%`} hint="Across completed quizzes" accent />
        <Stat icon={Crosshair} label="Latest quiz score" value={score === null ? "—" : `${score}%`} hint={score === null ? "Take your first quiz" : "Most recent result"} />
      </div>
      <div className="dashboard-columns">
        <section className="panel"><div className="panel-heading"><div><span className="section-kicker">KEEP GROWING</span><h2>Recommended for you</h2></div><BookOpen size={19} /></div>
          {recommendations.length ? <div className="recommendation-list">{recommendations.map((lesson) => <Link className="recommendation-item" to="/learn" key={lesson.id}><span className="recommendation-icon"><BookOpen size={17} /></span><span><strong>{lesson.title}</strong><small>Based on: {lesson.relatedWarningSigns.join(", ")}</small></span><ArrowRight size={16} /></Link>)}</div> : <div className="empty-mini"><span className="empty-icon"><BookOpen size={21} /></span><strong>{stats.quizzesAttempted ? "You’re building great habits." : "Your learning path starts here."}</strong><p>{stats.quizzesAttempted ? "No recurring missed warning signs yet. Explore a lesson to keep sharpening your skills." : "Complete a quiz and we’ll suggest lessons based on what you find tricky."}</p><Link to={stats.quizzesAttempted ? "/learn" : "/quiz"} className="text-link">{stats.quizzesAttempted ? "Browse all lessons" : "Take your first quiz"} <ArrowRight size={15} /></Link></div>}
        </section>
        <section className="panel"><div className="panel-heading"><div><span className="section-kicker">PATTERNS TO WATCH</span><h2>Commonly missed signs</h2></div><Crosshair size={19} /></div>
          {data.commonlyMissed.length ? <div className="missed-list">{data.commonlyMissed.map(({ warningSign, count }) => <div className="missed-item" key={warningSign}><div><span>{warningSign}</span><strong>{count} {count === 1 ? "miss" : "misses"}</strong></div><div className="progress-track"><span style={{ width: `${Math.min(100, count * 25)}%` }} /></div></div>)}</div> : <div className="empty-mini"><span className="empty-icon"><Target size={21} /></span><strong>No missed warning signs yet</strong><p>{stats.quizzesAttempted ? "Great work—keep practicing to maintain your awareness." : "Your results will reveal which warning signs deserve extra practice."}</p></div>}
        </section>
      </div>
      <section className="panel history-panel"><div className="panel-heading"><div><span className="section-kicker">YOUR ACTIVITY</span><h2>Recent quiz history</h2></div><Clock3 size={19} /></div>
        {data.recentHistory.length ? <div className="history-table"><div className="history-row history-header"><span>QUIZ</span><span>DATE</span><span>RESULT</span><span>SCORE</span></div>{data.recentHistory.map((item) => <div className="history-row" key={item.id}><strong>{item.quizTitle}</strong><span>{new Date(item.completionDate).toLocaleDateString()}</span><span>{item.correctAnswers}/{item.totalQuestions} correct</span><span className={`score-pill ${item.scorePercentage >= 70 ? "score-good" : "score-low"}`}>{item.scorePercentage}%</span></div>)}</div> : <div className="empty-history"><Clock3 size={21} /><span>No completed quizzes yet. Your results will show up here.</span><Link to="/quiz" className="text-link">Start a quiz <ArrowRight size={15} /></Link></div>}
      </section>
    </main>
  );
}

function Stat({ icon: Icon, label, value, hint, accent }) {
  return <article className={`stat-card${accent ? " stat-accent" : ""}`}><span className="stat-icon"><Icon size={18} /></span><span className="stat-label">{label}</span><strong>{value}</strong><small>{hint}</small></article>;
}
