import type { HistoryEntry } from "../../types/tutor";
import "./HistoryList.css";

interface HistoryListProps {
  history: HistoryEntry[];
}

export function HistoryList({ history }: HistoryListProps) {
  return (
    <div className="history-box">
      <h3>Recent Analyses</h3>
      {history.length === 0 ? (
        <p>No analyses saved yet.</p>
      ) : (
        <div className="history-list">
          {history.slice(0, 5).map((item, index) => (
            <div className="history-item" key={index}>
              <strong>
                {item.subject} · {item.grade}
              </strong>
              <span>{item.createdAt}</span>
              <p>{item.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
