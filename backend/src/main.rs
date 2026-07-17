mod claude_client;
mod fallback;
mod handlers;
mod models;

use axum::{
    routing::{get, post},
    Router,
};
use dotenvy::dotenv;
use std::{env, net::SocketAddr};
use tokio::net::TcpListener;
use tower_http::cors::{Any, CorsLayer};

#[derive(Clone)]
pub struct AppState {
    pub claude_api_key: String,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt::init();
    dotenv().ok();

    let claude_api_key = resolve_api_key();
    let app_state = AppState { claude_api_key };

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/health", get(handlers::health_check))
        .route("/api/tutor", post(handlers::analyze_problem))
        .layer(cors)
        .with_state(app_state);

    let addr = SocketAddr::from(([127, 0, 0, 1], 5173));
    let listener = TcpListener::bind(addr).await?;
    println!("MyTutor backend running on http://{}", addr);
    axum::serve(listener, app).await?;
    Ok(())
}

fn resolve_api_key() -> String {
    env::var("CLAUDE_API_KEY")
        .or_else(|_| env::var("ANTHROPIC_API_KEY"))
        .unwrap_or_default()
}

#[cfg(test)]
mod tests {
    use super::resolve_api_key;

    #[test]
    fn resolve_api_key_prefers_claude_env() {
        let previous = std::env::var("CLAUDE_API_KEY").ok();
        let previous_anthropic = std::env::var("ANTHROPIC_API_KEY").ok();
        std::env::set_var("CLAUDE_API_KEY", "test-key");
        std::env::remove_var("ANTHROPIC_API_KEY");

        assert_eq!(resolve_api_key(), "test-key");

        match previous {
            Some(value) => std::env::set_var("CLAUDE_API_KEY", value),
            None => std::env::remove_var("CLAUDE_API_KEY"),
        }
        match previous_anthropic {
            Some(value) => std::env::set_var("ANTHROPIC_API_KEY", value),
            None => std::env::remove_var("ANTHROPIC_API_KEY"),
        }
    }
}
