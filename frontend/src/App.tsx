import { ProblemForm, type ProblemFormValues } from "./components/ProblemForm/ProblemForm";
import { ResultPanel } from "./components/ResultPanel/ResultPanel";
import { HistoryList } from "./components/HistoryList/HistoryList";
import { useAnalyzeProblem } from "./hooks/useAnalyzeProblem";
import { useProblemHistory } from "./hooks/useProblemHistory";
import "./App.css";

function App() {
  const { status, result, error, analyze } = useAnalyzeProblem();
  const { history, addEntry } = useProblemHistory();

  const handleSubmit = async ({ grade, subject, problemText, imageDataUrl }: ProblemFormValues) => {
    if (!problemText) {
      return;
    }

    const response = await analyze({
      grade,
      subject,
      problem_text: problemText,
      image_base64: imageDataUrl,
    });

    if (response) {
      addEntry({
        grade,
        subject,
        summary: response.idea,
        createdAt: new Date().toLocaleString(),
      });
    }
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <p className="eyebrow">AI Study Tutor</p>
        <h1>MyTutor</h1>
        <p className="hero-text">
          Upload a photo of a problem you're stuck on, and MyTutor will walk you through where
          you went wrong and how to solve it — years 1 through 12.
        </p>
      </header>

      <main className="content-grid">
        <ProblemForm isSubmitting={status === "loading"} onSubmit={handleSubmit} />

        <section className="panel result-panel">
          <h2>MyTutor's Feedback</h2>
          <ResultPanel status={status} result={result} error={error} />
          <HistoryList history={history} />
        </section>
      </main>
    </div>
  );
}

export default App;
