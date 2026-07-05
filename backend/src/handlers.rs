use axum::{extract::State, http::StatusCode, response::Json};

use crate::claude_client::analyze_with_claude;
use crate::models::{TutorRequest, TutorResponse};
use crate::AppState;

pub async fn health_check() -> StatusCode {
    StatusCode::OK
}

pub async fn analyze_problem(
    State(state): State<AppState>,
    Json(payload): Json<TutorRequest>,
) -> Result<Json<TutorResponse>, StatusCode> {
    let response = analyze_with_claude(&state.claude_api_key, &payload).await;
    Ok(Json(response))
}
