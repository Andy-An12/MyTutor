import { useEffect, useState } from "react";
import type { TutorResponse } from "../../types/tutor";
import "./ResultPanel.css";

interface ResultPanelProps {
  status: "idle" | "loading" | "success" | "error";
  result: TutorResponse | null;
  error: string | null;
}

export function ResultPanel({ status, result, error }: ResultPanelProps) {
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  // Reset the reveal state whenever a new result comes in, so a fresh
  // problem doesn't inherit the previous one's revealed answer.
  useEffect(() => {
    setIsAnswerRevealed(false);
  }, [result]);

  if (status === "idle") {
    return (
      <div className="result-placeholder">
        <p>Upload a photo and describe the problem to see your analysis here.</p>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="result-placeholder">
        <p>Analyzing with Claude...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="result-placeholder">
        <p>{error ?? "Something went wrong. Please check that the backend server is running."}</p>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div>
      <div className="result-card">
        <h3>
          <span className="mark-num" aria-hidden="true">1</span> Where you went wrong
        </h3>
        <p>{result.issue}</p>
      </div>
      <div className="result-card">
        <h3>
          <span className="mark-num" aria-hidden="true">2</span> How to approach it
        </h3>
        <p>{result.idea}</p>
      </div>
      <div className="result-card">
        <h3>
          <span className="mark-num" aria-hidden="true">3</span> Solution steps
        </h3>
        <ul>
          {result.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ul>
      </div>

      <p className="reveal-hint">
        Try solving it yourself using the hints above first. Once you're done, check the answer.
      </p>

      {isAnswerRevealed ? (
        <div className="answer-area">
          <div className="result-card answer-card">
            <h3>
              <span className="mark-num" aria-hidden="true">4</span> Answer
            </h3>
            <p>{result.answer_hint}</p>
          </div>
          <div className="result-card">
            <h3>
              <span className="mark-num" aria-hidden="true">5</span> Study tip
            </h3>
            <p>{result.study_tip}</p>
          </div>
        </div>
      ) : (
        <button type="button" className="reveal-btn" onClick={() => setIsAnswerRevealed(true)}>
          Reveal Answer
        </button>
      )}
    </div>
  );
}
