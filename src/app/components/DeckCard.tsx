import { ArrowUpRight, Bookmark, Layers, Check } from "lucide-react";
import type { Deck, Progress } from "@/lib/types";
import { TopicIcon } from "./Icon";
export function DeckCard({
  deck,
  saved,
  progress,
  onSave,
  onStudy,
}: {
  deck: Deck;
  saved: boolean;
  progress: Progress;
  onSave?: () => void;
  onStudy: () => void;
}) {
  const known = deck.words.filter((w) => progress[w.id] === "known").length;
  return (
    <article className="deck-card">
      <div className={`deck-art ${deck.color}`}>
        <div className="art-dots" />
        <span className="topic-illustration">
          <TopicIcon name={deck.icon} size={43} />
        </span>
        <span className="level-badge">{deck.level}</span>
        {onSave && (
          <button
            className={`bookmark icon-button ${saved ? "saved" : ""}`}
            aria-label={`${saved ? "Unsave" : "Save"} ${deck.title}`}
            aria-pressed={saved}
            onClick={onSave}
          >
            <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
          </button>
        )}
      </div>
      <div className="deck-content">
        <div className="deck-topic">
          {deck.topic}
          {deck.custom && <span>YOUR SET</span>}
        </div>
        <button className="deck-title" onClick={onStudy}>
          {deck.title}
          <ArrowUpRight size={19} />
        </button>
        <p>{deck.description}</p>
        <div className="deck-bottom">
          <span>
            <Layers size={15} />
            {deck.words.length} {deck.words.length === 1 ? "word" : "words"}
          </span>
          {known > 0 ? (
            <span className="known-caption">
              <Check size={14} />
              {known} learned
            </span>
          ) : (
            <span>
              EN <span className="tiny-arrow">↔</span> VI
            </span>
          )}
        </div>
        {known > 0 && (
          <div className="card-progress">
            <span style={{ width: `${(known / deck.words.length) * 100}%` }} />
          </div>
        )}
      </div>
    </article>
  );
}
