use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct TutorRequest {
    pub grade: String,
    pub subject: String,
    pub problem_text: String,
    pub image_base64: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct TutorResponse {
    pub issue: String,
    pub idea: String,
    pub steps: Vec<String>,
    pub answer_hint: String,
    pub study_tip: String,
    pub mode: String,
}

#[derive(Debug, Deserialize)]
pub struct ClaudeAnswer {
    pub issue: String,
    pub idea: String,
    pub steps: Vec<String>,
    pub answer_hint: String,
    pub study_tip: String,
}
