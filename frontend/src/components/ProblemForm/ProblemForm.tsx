import { useState } from "react";
import { ImageUpload } from "../ImageUpload/ImageUpload";
import { YEAR_OPTIONS, SUBJECT_OPTIONS } from "../../types/tutor";
import { useImageUpload } from "../../hooks/useImageUpload";
import "./ProblemForm.css";

export interface ProblemFormValues {
  grade: string;
  subject: string;
  problemText: string;
  imageDataUrl: string | null;
}

interface ProblemFormProps {
  isSubmitting: boolean;
  onSubmit: (values: ProblemFormValues) => void;
}

export function ProblemForm({ isSubmitting, onSubmit }: ProblemFormProps) {
  const [grade, setGrade] = useState(YEAR_OPTIONS[0].value);
  const [subject, setSubject] = useState(SUBJECT_OPTIONS[0].value);
  const [problemText, setProblemText] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const { imageDataUrl, handleFileChange } = useImageUpload();

  const handleSubmit = () => {
    const trimmedText = problemText.trim();
    if (!trimmedText) {
      setValidationError(
        "Please describe the problem or what's confusing you. A photo alone isn't enough to start the analysis.",
      );
      return;
    }
    setValidationError(null);
    onSubmit({ grade, subject, problemText: trimmedText, imageDataUrl });
  };

  return (
    <section className="panel form-panel">
      <h2>Submit a Problem</h2>

      <ImageUpload imageDataUrl={imageDataUrl} onFileChange={handleFileChange} />

      <div className="grid-two">
        <label>
          <span>Year</span>
          <select value={grade} onChange={(event) => setGrade(event.target.value)}>
            {YEAR_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Subject</span>
          <select value={subject} onChange={(event) => setSubject(event.target.value)}>
            {SUBJECT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="field-label" htmlFor="problemText">
        Describe the problem or what's confusing you
      </label>
      <textarea
        id="problemText"
        rows={6}
        placeholder="Example: I'm confused about fraction addition. My answer was wrong — please tell me where I went wrong."
        value={problemText}
        onChange={(event) => setProblemText(event.target.value)}
      />

      {validationError && <p className="form-error">{validationError}</p>}

      <button type="button" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Analyzing..." : "Analyze Problem"}
      </button>
    </section>
  );
}
