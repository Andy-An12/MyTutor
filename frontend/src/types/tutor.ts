export interface TutorRequest {
  grade: string;
  subject: string;
  problem_text: string;
  image_base64: string | null;
}

export interface TutorResponse {
  issue: string;
  idea: string;
  steps: string[];
  answer_hint: string;
  study_tip: string;
  mode: string;
}

export interface HistoryEntry {
  grade: string;
  subject: string;
  summary: string;
  createdAt: string;
}

export const YEAR_OPTIONS = [
  { value: "1-3", label: "Year 1-3" },
  { value: "4-6", label: "Year 4-6" },
  { value: "7-9", label: "Year 7-9" },
  { value: "10-12", label: "Year 10-12" },
];

export const SUBJECT_OPTIONS = [
  { value: "Math", label: "Math" },
  { value: "English", label: "English" },
  { value: "Science", label: "Science" },
  { value: "Social Studies", label: "Social Studies" },
];
