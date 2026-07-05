use crate::fallback::build_local_feedback;
use crate::models::{ClaudeAnswer, TutorRequest, TutorResponse};

const CLAUDE_MODEL: &str = "claude-sonnet-5";

/// Splits a data URL like "data:image/png;base64,AAAA..." into (media_type, base64_data).
fn parse_data_url(data_url: &str) -> Option<(String, String)> {
    let rest = data_url.strip_prefix("data:")?;
    let (meta, data) = rest.split_once(',')?;
    let media_type = meta.split(';').next().unwrap_or("image/png").to_string();
    Some((media_type, data.to_string()))
}

fn response_schema() -> serde_json::Value {
    serde_json::json!({
        "type": "object",
        "properties": {
            "issue": { "type": "string", "description": "Where the student went wrong or got stuck" },
            "idea": { "type": "string", "description": "An idea for how to approach the problem (do not state the final answer here)" },
            "steps": { "type": "array", "items": { "type": "string" }, "description": "A step-by-step solution outline" },
            "answer_hint": { "type": "string", "description": "The final answer and why it follows from the idea and steps above" },
            "study_tip": { "type": "string", "description": "A study tip to avoid similar mistakes next time" }
        },
        "required": ["issue", "idea", "steps", "answer_hint", "study_tip"],
        "additionalProperties": false
    })
}

fn build_prompt(payload: &TutorRequest) -> String {
    format!(
        "You are a study tutor for K-12 students. Look at the photo and description and tell \
        the student where they went wrong and how to approach the problem, then give the \
        final answer last, based on that reasoning. Don't just state the answer directly — \
        explain why it follows from the solution steps. Respond in English.\n\
        Year: {}\nSubject: {}\nProblem description: {}",
        payload.grade, payload.subject, payload.problem_text
    )
}

async fn request_claude_message(
    api_key: &str,
    payload: &TutorRequest,
) -> Result<String, reqwest::Error> {
    let client = reqwest::Client::new();
    let mut content = serde_json::json!([]);
    let content_arr = content.as_array_mut().unwrap();

    if let Some(data_url) = &payload.image_base64 {
        if let Some((media_type, data)) = parse_data_url(data_url) {
            content_arr.push(serde_json::json!({
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": media_type,
                    "data": data
                }
            }));
        }
    }
    content_arr.push(serde_json::json!({ "type": "text", "text": build_prompt(payload) }));

    let response = client
        .post("https://api.anthropic.com/v1/messages")
        .header("x-api-key", api_key)
        .header("anthropic-version", "2023-06-01")
        .header("content-type", "application/json")
        .json(&serde_json::json!({
            "model": CLAUDE_MODEL,
            "max_tokens": 4096,
            "output_config": {
                "format": {
                    "type": "json_schema",
                    "schema": response_schema()
                }
            },
            "messages": [{
                "role": "user",
                "content": content
            }]
        }))
        .send()
        .await?;

    let body: serde_json::Value = response.json().await?;
    let text = body["content"]
        .as_array()
        .and_then(|blocks| blocks.iter().find(|block| block["type"] == "text"))
        .and_then(|block| block["text"].as_str())
        .unwrap_or_default()
        .to_string();
    Ok(text)
}

fn parse_claude_answer(text: &str, payload: &TutorRequest) -> TutorResponse {
    match serde_json::from_str::<ClaudeAnswer>(text) {
        Ok(answer) => TutorResponse {
            issue: answer.issue,
            idea: answer.idea,
            steps: answer.steps,
            answer_hint: answer.answer_hint,
            study_tip: answer.study_tip,
            mode: "claude".to_string(),
        },
        Err(_) => build_local_feedback(payload),
    }
}

/// Analyzes a student's problem, using Claude when an API key is configured and
/// falling back to a local rule-based response otherwise (or on failure).
pub async fn analyze_with_claude(api_key: &str, payload: &TutorRequest) -> TutorResponse {
    if api_key.trim().is_empty() {
        return build_local_feedback(payload);
    }

    match request_claude_message(api_key, payload).await {
        Ok(text) => parse_claude_answer(&text, payload),
        Err(_) => build_local_feedback(payload),
    }
}
