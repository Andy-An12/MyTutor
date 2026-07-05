use crate::models::{TutorRequest, TutorResponse};

/// Builds a generic, rule-based response used when no Claude API key is configured
/// or when the Claude call fails.
pub fn build_local_feedback(payload: &TutorRequest) -> TutorResponse {
    let issue = match payload.subject.as_str() {
        "Math" => {
            "Re-read the problem's conditions first, and write out each calculation step \
            separately instead of doing them all at once."
                .to_string()
        }
        "English" => {
            "Try breaking the sentence into its structure and word meanings separately \
            to reduce mistakes."
                .to_string()
        }
        "Science" => {
            "Try connecting the concept with the given conditions to make it easier to \
            find where you went wrong."
                .to_string()
        }
        _ => "Try reorganizing your work around the key terms in the problem.".to_string(),
    };

    let idea = format!(
        "For a {} problem at year {}, first write down exactly what is being asked, \
        then solve it one step at a time.",
        payload.subject, payload.grade
    );

    let steps = vec![
        "Write down what the problem is asking for in one sentence".to_string(),
        "Separate what's given from what's unknown".to_string(),
        "Write out your solution one step at a time".to_string(),
        "Check that your final answer matches the problem's conditions".to_string(),
    ];

    TutorResponse {
        issue,
        idea,
        steps,
        answer_hint: "Before settling on an answer, review your conditions and solution \
            steps once more."
            .to_string(),
        study_tip: "Rewriting a problem you got wrong in your own words helps you remember \
            where you made the mistake."
            .to_string(),
        mode: "local".to_string(),
    }
}
