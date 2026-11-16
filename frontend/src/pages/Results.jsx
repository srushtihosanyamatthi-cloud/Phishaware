import { useCallback, useEffect, useState } from "react";
import { ArrowRight, BookOpen, RotateCcw, ShieldCheck, Trophy } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../services/api.js";
import Loading from "../components/Loading.jsx";
import Alert from "../components/Alert.jsx";

export default function Results() {
  const { attemptId } = useParams();
  const { user } = useAuth();
  const [result, setResult] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const loadResults = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [attempt, suggested] = await Promise.all([
        api(`/progress/attempts/${attemptId}`),
        api(`/progress/${user.id}/recommendations`),
      ]);
      setResult(attempt.result);
      setRecommendations(suggested.recommendations);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [attemptId, user.id]);
  useEffect(() => { loadResults(); }, [loadResults]);

  if (loading) return <main className="page-shell"><Loading label="Loading your results..." /></main>;
  if (error) return <main className="page-shell"><Alert onRetry={loadResults}>{error}</Alert></main>;
  if (!result) return null;

  const heading = result.scorePercentage >= 80 ? "Excellent instincts." : result.scorePercentage >= 60 ? "Good progress." : "Every miss is a chance to learn.";
  return <main className="page-shell results-page">
    <div className="results-hero"><span className="results-trophy"><Trophy size={25} /></span><span className="section-kicker">QUIZ COMPLETE</span><h1>{heading}</h1><p>{result.quizTitle} · {new Date(result.completionDate).toLocaleDateString()}</p></div>
    <section className="result-score-card"><div className="score-ring" style={{ "--score": `${result.scorePercentage}%` }}><div><strong>{result.scorePercentage}%</strong><span>YOUR SCORE</span></div></div><div className="score-summary"><h2>{result.correctAnswers} out of {result.totalQuestions} correct</h2><p>{result.scorePercentage >= 80 ? "You recognized most of the signals. Stay curious and keep verifying unexpected requests." : "Review the signals below, then try another round to strengthen your instincts."}</p><div className="answer-counts"><span className="count-correct">{result.correctAnswers} correct</span><span className="count-incorrect">{result.incorrectAnswers} to review</span></div></div></section>
    {result.missedWarningSigns.length > 0 && <section className="panel results-section"><div className="panel-heading"><div><span className="section-kicker">FOCUS AREAS</span><h2>Warning signs to review</h2></div><ShieldCheck size={19} /></div><div className="result-signs">{result.missedWarningSigns.map((sign) => <span key={sign}>{sign}</span>)}</div></section>}
    <section className="panel results-section"><div className="panel-heading"><div><span className="section-kicker">YOUR NEXT STEP</span><h2>Recommended lessons</h2></div><BookOpen size={19} /></div>{recommendations.length ? <div className="recommendation-list">{recommendations.map((lesson) => <Link className="recommendation-item" to="/learn" key={lesson.id}><span className="recommendation-icon"><BookOpen size={17} /></span><span><strong>{lesson.title}</strong><small>{lesson.description}</small></span><ArrowRight size={16} /></Link>)}</div> : <div className="empty-mini"><strong>No specific review needed.</strong><p>Explore the learning library to keep building your awareness.</p><Link to="/learn" className="text-link">Browse lessons <ArrowRight size={15} /></Link></div>}</section>
    <section className="panel results-section"><div className="panel-heading"><div><span className="section-kicker">ANSWER REVIEW</span><h2>What to notice</h2></div></div><div className="review-list">{result.answers.map((answer) => <article className="review-item" key={answer.questionId}><div className={`review-status ${answer.isCorrect ? "review-good" : "review-missed"}`}>{answer.isCorrect ? "Correct" : "Review"}</div><div><strong>{answer.subject}</strong><p>{answer.explanation}</p>{answer.warningSigns.length > 0 && <small>Warning signs: {answer.warningSigns.join(" · ")}</small>}</div></article>)}</div></section>
    <div className="results-actions"><Link to="/quiz" className="button button-primary"><RotateCcw size={17} /> Retake quiz</Link><Link to="/dashboard" className="button button-outline">View dashboard <ArrowRight size={16} /></Link></div>
  </main>;
}
