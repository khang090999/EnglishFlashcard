import { createDeckId } from "@/lib/id";
import { useMemo, useState } from "react";
import { Search, Plus, Check, ArrowRight, GraduationCap } from "lucide-react";
import { starterDecks, levelNames } from "@/data/vocabulary";
import { LEVELS, type Deck, type Level } from "@/lib/types";
export function Prepare({ onSave }: { onSave: (deck: Deck) => void }) {
  const [level, setLevel] = useState<Level>("A1");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [title, setTitle] = useState("");
  const words = useMemo(
    () => starterDecks.filter((d) => d.level === level).flatMap((d) => d.words),
    [level],
  );
  const filtered = words.filter((w) =>
    `${w.english} ${w.vietnamese}`
      .toLocaleLowerCase()
      .includes(query.toLocaleLowerCase()),
  );
  function toggle(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function save() {
    if (!title.trim() || !selected.size) return;
    const id = createDeckId(globalThis.crypto);
    onSave({
      id,
      title: title.trim(),
      description: "Handpicked words for your next lesson.",
      level,
      topic: "My vocabulary",
      color: "green",
      icon: "graduation",
      custom: true,
      words: words.filter((w) => selected.has(w.id)).map((w) => ({ ...w })),
    });
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">A LITTLE PREPARATION GOES A LONG WAY</span>
          <h1>Make room for new words.</h1>
          <p>Choose a level. Pick your vocabulary. Make it your own.</p>
        </div>
        <span className="heading-icon">
          <GraduationCap size={31} />
        </span>
      </div>
      <div className="prepare-layout">
        <section className="word-bank">
          <div className="section-head">
            <h2>Vocabulary bank</h2>
            <span className="muted">{words.length} words</span>
          </div>
          <div className="level-tabs" aria-label="Vocabulary level">
            {LEVELS.map((l) => (
              <button
                key={l}
                aria-pressed={level === l}
                className={level === l ? "active" : ""}
                onClick={() => {
                  setLevel(l);
                  setSelected(new Set());
                  setQuery("");
                }}
              >
                {l}
                <small>{levelNames[l]}</small>
              </button>
            ))}
          </div>
          <label className="search">
            <Search size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a word or Vietnamese meaning"
              aria-label="Search vocabulary"
            />
          </label>
          <div className="word-list-toolbar">
            <span>
              {filtered.length} words · {levelNames[level]}
            </span>
            <button
              className="text-button"
              disabled={!filtered.length}
              onClick={() => {
                const all = filtered.every((w) => selected.has(w.id));
                setSelected((s) => {
                  const next = new Set(s);
                  filtered.forEach((w) =>
                    all ? next.delete(w.id) : next.add(w.id),
                  );
                  return next;
                });
              }}
            >
              {filtered.length > 0 && filtered.every((w) => selected.has(w.id))
                ? "Deselect visible"
                : "Select visible"}
            </button>
          </div>
          <div className="word-list">
            {filtered.map((w) => (
              <label
                className={`word-row ${selected.has(w.id) ? "selected" : ""}`}
                key={w.id}
              >
                <input
                  type="checkbox"
                  checked={selected.has(w.id)}
                  onChange={() => toggle(w.id)}
                />
                <span>
                  <strong>{w.english}</strong>
                  <small>{w.phonetic}</small>
                </span>
                <span lang="vi">{w.vietnamese}</span>
              </label>
            ))}
            {!filtered.length && (
              <div className="empty-state small">
                <Search />
                <h3>No matching words</h3>
                <p>Try a different English word or Vietnamese meaning.</p>
              </div>
            )}
          </div>
        </section>
        <aside className="selection-panel">
          <div className="selection-icon">
            <Plus size={23} />
          </div>
          <h2>Your next study set</h2>
          <p>A thoughtful little collection for your students, or yourself.</p>
          <label>
            Set name
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
              placeholder="e.g. Monday’s vocabulary"
            />
          </label>
          <div className="selection-count">
            <span>
              {level} · {levelNames[level]}
            </span>
            <strong>{selected.size} words</strong>
          </div>
          {selected.size > 0 ? (
            <div className="selected-words">
              {words
                .filter((w) => selected.has(w.id))
                .map((w) => (
                  <button
                    key={w.id}
                    onClick={() => toggle(w.id)}
                    aria-label={`Remove ${w.english}`}
                  >
                    {w.english}
                    <Check size={12} />
                  </button>
                ))}
            </div>
          ) : (
            <div className="selection-placeholder">
              Your selected words will appear here.
            </div>
          )}
          <button
            className="button primary full"
            disabled={!title.trim() || !selected.size}
            onClick={save}
          >
            Create study set <ArrowRight size={17} />
          </button>
          <p className="field-help">
            Saved to My sets on this device. Changing levels starts a new
            selection.
          </p>
        </aside>
      </div>
      <p className="curriculum-note">
        Levels are suggested teaching guides. Adjust your selection to suit your
        students.
      </p>
    </>
  );
}
