import { useCallback, useState } from "react";
import { analyzeProblem } from "../api/tutorApi";
import type { TutorRequest, TutorResponse } from "../types/tutor";

type Status = "idle" | "loading" | "success" | "error";

export function useAnalyzeProblem() {
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<TutorResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (request: TutorRequest) => {
    setStatus("loading");
    setError(null);
    try {
      const response = await analyzeProblem(request);
      setResult(response);
      setStatus("success");
      return response;
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
      return null;
    }
  }, []);

  return { status, result, error, analyze };
}
