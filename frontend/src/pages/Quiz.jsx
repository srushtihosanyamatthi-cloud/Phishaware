import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CircleAlert, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../services/api.js";
import Loading from "../components/Loading.jsx";
import Alert from "../components/Alert.jsx";

export default function Quiz() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [attemptId, setAttemptId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadQuiz = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const list = await api("/quizzes");
      if (!list.quizzes.length) throw new Error("There are no quizzes available yet.");
      const response = await api(`/quizzes/${list.quizzes[0].id}`);
      setQuiz(response.quiz);
      const key = `phishaware-attempt:${user.id}:${response.quiz._id}`;
      const saved = JSON.parse(sessionStorage.getItem(key) || "null");
      if (saved && saved.index < response.quiz.questions.length) {
        let savedAnswer;
        if (saved.attemptId) {
          const attempt = await api(`/progress/attempts/${saved.attemptId}`);
          if (attempt.result.completed) {
            sessionStorage.removeItem(key);
            navigate(`/results/${saved.attemptId}`, { replace: true });
            return;
          }
          savedAnswer = attempt.result.answers.find(
            (answer) => answer.questionId === response.quiz.questions[saved.index]._id
          );
        }
        setIndex(saved.index);
        setAttemptId(saved.attemptId || "");
        setSelected(savedAnswer?.selectedAnswer || "");
        setFeedback(savedAnswer ? {
          selectedAnswer: savedAnswer.selectedAnswer,
          correctAnswer: savedAnswer.correctAnswer,
          isCorrect: savedAnswer.isCorrect,
          explanation: savedAnswer.explanation,
          warningSigns: savedAnswer.warningSigns,
          missedWarningSigns: savedAnswer.missedWarningSigns,
        } : null);
      } else {
        setIndex(0);
        setAttemptId("");
        setSelected("");
        setFeedback(null);
        sessionStorage.removeItem(key);
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [navigate, user.id]);

  useEffect(() => { loadQuiz(); }, [loadQuiz]);
  if (loading) return <main className="page-shell"><Loading label="Loading a quiz..." /></main>;
  if (error) return <main className="page-shell"><Alert onRetry={loadQuiz}>{error}</Alert></main>;
  if (!quiz) return null;

  const question = quiz.questions[index];
  const percent = Math.round(((index + (feedback ? 1 : 0)) / quiz.questions.length) * 100);

  async function submitAnswer() {
    if (!selected || submitting || feedback) return;
    setSubmitting(true);
    setError("");
    try {
      const data = await api("/quizzes/submit", {
        method: "POST",
        body: JSON.stringify({
          quizId: quiz._id,
          questionId: question._id,
          selectedAnswer: selected,
          ...(attemptId ? { attemptId } : {}),
        }),
      });
      setAttemptId(data.attemptId);
      setFeedback(data.feedback);
      const key = `phishaware-attempt:${user.id}:${quiz._id}`;
      if (data.progress.completed) {
        sessionStorage.removeItem(key);
        navigate(`/results/${data.attemptId}`, { replace: true });
      } else {
        sessionStorage.setItem(key, JSON.stringify({ attemptId: data.attemptId, index }));
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  function nextQuestion() {
    const nextIndex = index + 1;
    setIndex(nextIndex);
    setSelected("");
    setFeedback(null);
    sessionStorage.setItem(`phishaware-attempt:${user.id}:${quiz._id}`, JSON.stringify({ attemptId, index: nextIndex }));
  }

  return (
    <main className="page-shell quiz-page">
      <Link to="/dashboard" className="back-link"><ArrowLeft size={16} /> Back to dashboard</Link>
      <div className="quiz-heading"><span className="section-kicker">PRACTICE MAKES PREPARED</span><h1>{quiz.title}</h1><p>{quiz.description}</p></div>
      <div className="quiz-progress"><div className="quiz-progress-label"><span>Question {index + 1} of {quiz.questions.length}</span><span>{percent}% complete</span></div><div className="progress-track"><span style={{ width: `${percent}%` }} /></div></div>
      <div className="quiz-card">
        <div className="email-sample"><div className="email-topline"><span className="email-icon"><ShieldCheck size={17} /></span><span>FICTIONAL EMAIL EXAMPLE</span><span className="safe-label">SAFE PRACTICE</span></div>
          <div className="email-field"><span>FROM</span><strong>{question.senderEmail}</strong></div>
          <div className="email-field"><span>SUBJECT</span><strong>{question.subject}</strong></div>
          <div className="email-body">{question.message}</div>
          {question.suspiciousLink && <div className="sample-link"><span>LINK</span><code>{question.suspiciousLink}</code></div>}
        </div>
        <div className="question-area"><div className="question-label">YOUR READ</div><h2>{question.question}</h2><div className="answer-options">{question.options.map((option) => <button key={option} type="button" className={`answer-option${selected === option ? " answer-selected" : ""}${feedback?.selectedAnswer === option ? (feedback.isCorrect ? " answer-correct" : " answer-incorrect") : ""}`} onClick={() => !feedback && setSelected(option)} disabled={Boolean(feedback)}><span className="radio-dot">{feedback?.selectedAnswer === option && feedback.isCorrect ? <Check size={13} /> : null}</span>{option}</button>)}</div>
          {!feedback && <button className="button button-primary submit-answer" type="button" onClick={submitAnswer} disabled={!selected || submitting}>{submitting ? "Checking your answer..." : "Submit answer"} {!submitting && <ArrowRight size={17} />}</button>}
          {error && <Alert>{error}</Alert>}
          {feedback && <div className={`feedback-box ${feedback.isCorrect ? "feedback-success" : "feedback-warning"}`}><div className="feedback-title">{feedback.isCorrect ? <Check size={18} /> : <CircleAlert size={18} />}{feedback.isCorrect ? "That's right!" : "Not quite — here's what to notice"}</div><p>{feedback.explanation}</p><div className="sign-list"><strong>Warning signs</strong>{feedback.warningSigns.length ? feedback.warningSigns.map((sign) => <span className={feedback.missedWarningSigns.includes(sign) ? "missed-sign" : ""} key={sign}>{sign}</span>) : <span className="no-signs">No strong warning signs in this example.</span>}</div><button className="button button-primary submit-answer" type="button" onClick={nextQuestion}>Next question <ArrowRight size={17} /></button></div>}
        </div>
      </div>
      <p className="quiz-disclaimer"><ShieldCheck size={15} /> Practice only: these fictional examples use harmless domains. Never enter real passwords or codes into an email link.</p>
    </main>
  );
}
