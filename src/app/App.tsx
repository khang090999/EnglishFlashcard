import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  ChartNoAxesCombined,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  GraduationCap,
  Grid2X2,
  Layers,
  List,
  Menu,
  Plus,
  Search,
  Sparkles,
  Target,
  Upload,
  X,
  Monitor,
  SlidersHorizontal,
  Leaf,
} from "lucide-react";
import { starterDecks, levelNames } from "@/data/vocabulary";
import { LEVELS, type Deck, type SavedState } from "@/lib/types";
import { decodeState, STORAGE_KEY } from "@/lib/storage";
import { DeckCard } from "./components/DeckCard";
import { ImportDialog } from "./components/ImportDialog";
import { Modal } from "./components/Modal";
import { Prepare } from "./components/Prepare";
import { Study } from "./components/Study";
import { TopicIcon } from "./components/Icon";
type Page = "library" | "sets" | "prepare" | "progress";
const pages = [
  { id: "library" as const, label: "Vocabulary library", icon: BookOpen },
  { id: "sets" as const, label: "My sets", icon: Layers },
  { id: "prepare" as const, label: "Prepare a lesson", icon: GraduationCap },
  { id: "progress" as const, label: "My progress", icon: ChartNoAxesCombined },
];
function initialState() {
  try {
    return decodeState(localStorage.getItem(STORAGE_KEY));
  } catch {
    return decodeState(null);
  }
}
export default function App() {
  const sidebarRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const [state, setState] = useState<SavedState>(initialState);
  const [storageError, setStorageError] = useState(false);
  const [page, setPage] = useState<Page>("library");
  const [activeDeck, setActiveDeck] = useState<Deck | null>(null);
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("All levels");
  const [topic, setTopic] = useState("All topics");
  const [layout, setLayout] = useState("grid");
  const [importOpen, setImportOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [myTab, setMyTab] = useState("all");
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [state]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    if (!mobileOpen) return;
    const sidebar = sidebarRef.current!;
    const previous = document.activeElement as HTMLElement;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sidebar.querySelector<HTMLButtonElement>(".mobile-close")?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setMobileOpen(false);
      }
      if (event.key !== "Tab") return;
      const targets = Array.from(
        sidebar.querySelectorAll<HTMLElement>("button:not(:disabled), a[href]"),
      ).filter(
        (el) =>
          el.getClientRects().length &&
          getComputedStyle(el).visibility !== "hidden",
      );
      const first = targets[0],
        last = targets[targets.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    function onResize() {
      if (window.innerWidth > 720) setMobileOpen(false);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      previous?.focus();
    };
  }, [mobileOpen]);
  const decks = useMemo(() => [...starterDecks, ...state.decks], [state.decks]);
  const uniqueWords = useMemo(
    () => [
      ...new Map(decks.flatMap((d) => d.words).map((w) => [w.id, w])).values(),
    ],
    [decks],
  );
  const learned = uniqueWords.filter(
    (w) => state.progress[w.id] === "known",
  ).length;
  const reviewed = uniqueWords.filter((w) => state.progress[w.id]).length;
  const myDecks = decks.filter(
    (d) => d.custom || state.bookmarks.includes(d.id),
  );
  const topics = [...new Set(decks.map((d) => d.topic))];
  const filtered = (page === "sets" ? myDecks : decks).filter(
    (d) =>
      (level === "All levels" || d.level === level) &&
      (topic === "All topics" || d.topic === topic) &&
      (page !== "sets" ||
        myTab === "all" ||
        (myTab === "created" ? d.custom : state.bookmarks.includes(d.id))) &&
      `${d.title} ${d.description} ${d.topic} ${d.words.map((w) => `${w.english} ${w.vietnamese}`).join(" ")}`
        .toLocaleLowerCase()
        .includes(query.toLocaleLowerCase()),
  );
  function navigate(next: Page) {
    setPage(next);
    setActiveDeck(null);
    setQuery("");
    setLevel("All levels");
    setTopic("All topics");
    setMobileOpen(false);
    window.scrollTo({ top: 0 });
  }
  function study(deck: Deck) {
    setActiveDeck(deck);
    setState((s) => ({ ...s, lastDeck: deck.id }));
    window.scrollTo({ top: 0 });
  }
  function saveDeck(deck: Deck) {
    setState((s) => ({ ...s, decks: [...s.decks, deck] }));
    setImportOpen(false);
    navigate("sets");
    setMyTab("all");
    setToast(`“${deck.title}” is ready to study.`);
  }
  function bookmark(deck: Deck) {
    setState((s) => ({
      ...s,
      bookmarks: s.bookmarks.includes(deck.id)
        ? s.bookmarks.filter((id) => id !== deck.id)
        : [...s.bookmarks, deck.id],
    }));
  }
  const resumeDeck =
    decks.find((d) => d.id === state.lastDeck) || starterDecks[0];
  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      {mobileOpen && (
        <button
          className="sidebar-scrim"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside ref={sidebarRef} className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <button
          className="brand"
          onClick={() => navigate("library")}
          aria-label="Lexi home"
        >
          <span className="brand-mark">
            <Layers size={23} />
          </span>
          lexi<span className="brand-dot">.</span>
        </button>
        <button
          className="mobile-close icon-button"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        >
          <X />
        </button>
        <div className="sidebar-caption">A LITTLE LEARNING, EVERY DAY</div>
        <div className="nav-label">YOUR LEARNING SPACE</div>
        <nav aria-label="Main navigation">
          {pages.map((p) => (
            <button
              key={p.id}
              className={`nav-item ${page === p.id ? "active" : ""}`}
              onClick={() => navigate(p.id)}
              aria-current={page === p.id ? "page" : undefined}
            >
              <p.icon size={19} />
              <span>{p.label}</span>
              {p.id === "sets" && myDecks.length > 0 && (
                <span className="nav-count">{myDecks.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="grow-card">
            <span className="grow-icon">
              <SproutDrawing />
            </span>
            <h3>Small steps. Big growth.</h3>
            <p>
              A few new words today.
              <br />A little more confidence tomorrow.
            </p>
            <button onClick={() => study(resumeDeck)}>
              Let’s practice <ArrowRight size={15} />
            </button>
          </div>
          <button className="help-button" onClick={() => setHelpOpen(true)}>
            <CircleHelp size={18} /> A little help <ChevronRight size={16} />
          </button>
          <div className="local-note">
            <span /> Your own little learning space
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumbs">
            <button
              ref={menuRef}
              className="mobile-menu icon-button"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={21} />
            </button>
            <span>Your workspace</span>
            <ChevronRight size={14} />
            <strong>
              {activeDeck
                ? "Flashcards"
                : pages.find((p) => p.id === page)?.label}
            </strong>
          </div>
          <div className="topbar-right">
            <span className="language-pair">
              English <span>↔</span> <span lang="vi">Tiếng Việt</span>
            </span>
            <span className="topbar-divider" />
            <span className="profile" title="Your local learner profile">
              L<span />
            </span>
          </div>
        </header>
        <main id="main" className="main-content">
          {storageError && (
            <div className="error-box" role="alert">
              Your browser could not save changes. Keep this tab open and
              download your sets from My sets before closing it.
            </div>
          )}
          {activeDeck ? (
            <Study
              key={activeDeck.id}
              deck={activeDeck}
              progress={state.progress}
              onGrade={(id, grade) =>
                setState((s) => ({
                  ...s,
                  progress: { ...s.progress, [id]: grade },
                }))
              }
              onBack={() => setActiveDeck(null)}
            />
          ) : page === "prepare" ? (
            <Prepare onSave={saveDeck} />
          ) : page === "progress" ? (
            <>
              <div className="page-heading">
                <div>
                  <span className="eyebrow">EVERY WORD IS A STEP FORWARD</span>
                  <h1>Look how far you’re growing.</h1>
                  <p>Your learning journey, one little win at a time.</p>
                </div>
                <span className="heading-icon">
                  <ChartNoAxesCombined size={30} />
                </span>
              </div>
              <div className="stats-row">
                <Stat
                  icon={<Check />}
                  value={learned}
                  label="Words learned"
                  color="green"
                />
                <Stat
                  icon={<Target />}
                  value={reviewed - learned}
                  label="Words to practice"
                  color="peach"
                />
                <Stat
                  icon={<Layers />}
                  value={
                    decks.filter((d) =>
                      d.words.every((w) => state.progress[w.id] === "known"),
                    ).length
                  }
                  label="Sets completed"
                  color="purple"
                />
              </div>
              <section className="progress-panel">
                <div className="section-head">
                  <h2>Your vocabulary journey</h2>
                  <span className="muted">A1 → C2</span>
                </div>
                {LEVELS.map((l) => {
                  const words = [
                    ...new Map(
                      decks
                        .filter((d) => d.level === l)
                        .flatMap((d) => d.words)
                        .map((w) => [w.id, w]),
                    ).values(),
                  ];
                  const count = words.filter(
                    (w) => state.progress[w.id] === "known",
                  ).length;
                  return (
                    <div className="level-progress" key={l}>
                      <span className="level-chip">{l}</span>
                      <div>
                        <strong>{levelNames[l]}</strong>
                        <div className="progress-track">
                          <span
                            style={{
                              width: `${(count / words.length) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                      <span>
                        {count} / {words.length}
                      </span>
                    </div>
                  );
                })}
              </section>
              <div className="section-head progress-sets-heading">
                <h2>
                  {reviewed
                    ? "Keep the momentum going"
                    : "Your first word is waiting"}
                </h2>
              </div>
              <div className="deck-grid">
                {(reviewed
                  ? decks.filter((d) =>
                      d.words.some((w) => state.progress[w.id]),
                    )
                  : starterDecks.slice(0, 3)
                ).map((d) => (
                  <DeckCard
                    key={d.id}
                    deck={d}
                    saved={state.bookmarks.includes(d.id)}
                    progress={state.progress}
                    onSave={() => bookmark(d)}
                    onStudy={() => study(d)}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="page-heading">
                <div>
                  <span className="eyebrow">
                    {page === "sets"
                      ? "COLLECTED BY YOU. LEARNED BY YOU."
                      : "YOUR NEXT WORD IS A NEW POSSIBILITY"}
                  </span>
                  <h1>
                    {page === "sets"
                      ? "A little collection of your own."
                      : "Big adventures start with small words."}
                  </h1>
                  <p>
                    {page === "sets"
                      ? "Your handpicked, bookmarked, and imported vocabulary sets."
                      : "Find your level, discover new words, and make them yours."}
                  </p>
                </div>
                <button
                  className="button secondary import-top"
                  onClick={() => setImportOpen(true)}
                >
                  <Upload size={17} /> Import vocabulary
                </button>
              </div>
              {page === "library" && (
                <section className="hero">
                  <div className="hero-copy">
                    <span className="hero-tag">
                      <Sparkles size={14} /> YOUR DAILY DOSE OF DISCOVERY
                    </span>
                    <h2>
                      A new word.
                      <br />A whole new world.
                    </h2>
                    <p>
                      A little practice goes a long way.
                      <br />
                      Build your confidence, one flashcard at a time.
                    </p>
                    <button
                      className="button primary"
                      onClick={() => study(resumeDeck)}
                    >
                      {state.lastDeck ? "Continue learning" : "Start learning"}
                      <ArrowRight size={18} />
                    </button>
                    <span className="hero-footnote">
                      Just you, a few words, and a fresh start.
                    </span>
                  </div>
                  <div className="hero-art" aria-hidden="true">
                    <span className="art-star star-one">✳</span>
                    <span className="art-star star-two">✧</span>
                    <div className="orbit orbit-one" />
                    <div className="orbit orbit-two" />
                    <div className="floating-card rear-card">
                      <span>TIẾNG VIỆT</span>
                      <strong>nở hoa</strong>
                      <Leaf size={24} />
                    </div>
                    <div className="floating-card front-card">
                      <span>ENGLISH</span>
                      <div className="flower">
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                        <b />
                      </div>
                      <strong>bloom</strong>
                      <small>/bluːm/</small>
                      <span className="art-card-bottom">
                        a little growth, every day <Sparkles size={12} />
                      </span>
                    </div>
                    <div className="art-caption">
                      <span>EN</span>
                      <RepeatArrow />
                      <span>VI</span>
                    </div>
                  </div>
                </section>
              )}
              <section className="library-section">
                <div className="section-head">
                  <div className="section-title">
                    <h2>
                      {page === "sets"
                        ? "My study sets"
                        : "Explore the vocabulary library"}
                    </h2>
                    <span className="count-badge">
                      {page === "sets" ? myDecks.length : decks.length} sets
                    </span>
                  </div>
                  {page === "library" ? (
                    <button
                      className="text-button prepare-link"
                      onClick={() => navigate("prepare")}
                    >
                      <GraduationCap size={17} /> Preparing a lesson?{" "}
                      <ArrowRight size={15} />
                    </button>
                  ) : (
                    <div className="sets-actions">
                      <button
                        className="text-button"
                        onClick={() => {
                          const content = state.decks
                            .map((d) =>
                              d.words
                                .map((w) =>
                                  [w.english, w.phonetic, w.vietnamese]
                                    .map((c) => `"${c.replaceAll('"', '""')}"`)
                                    .join(","),
                                )
                                .join("\n"),
                            )
                            .join("\n");
                          const blob = new Blob(
                            ["\uFEFFenglish,phonetic,vietnamese\n" + content],
                            { type: "text/csv;charset=utf-8" },
                          );
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = "lexi-my-vocabulary.csv";
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        disabled={!state.decks.length}
                      >
                        Export words
                      </button>
                      <button
                        className="text-button"
                        onClick={() => navigate("prepare")}
                      >
                        <Plus size={17} /> Create a set
                      </button>
                    </div>
                  )}
                </div>
                {page === "sets" && (
                  <div className="my-tabs">
                    {[
                      { id: "all", label: "All my sets" },
                      { id: "created", label: "Created by me" },
                      { id: "saved", label: "Bookmarked" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        className={myTab === t.id ? "active" : ""}
                        onClick={() => setMyTab(t.id)}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                )}
                <div className="filter-row">
                  <label className="search">
                    <Search size={18} />
                    <input
                      aria-label="Search vocabulary sets"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search a topic, set, or word..."
                    />
                    {query && (
                      <button
                        className="clear-search"
                        aria-label="Clear search"
                        onClick={() => setQuery("")}
                      >
                        <X size={15} />
                      </button>
                    )}
                  </label>
                  <label className="topic-filter">
                    <SlidersHorizontal size={15} />
                    <select
                      aria-label="Filter by topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    >
                      <option>All topics</option>
                      {topics.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} />
                  </label>
                  <div className="view-switch">
                    <button
                      aria-label="Grid view"
                      aria-pressed={layout === "grid"}
                      className={layout === "grid" ? "active" : ""}
                      onClick={() => setLayout("grid")}
                    >
                      <Grid2X2 size={17} />
                    </button>
                    <button
                      aria-label="List view"
                      aria-pressed={layout === "list"}
                      className={layout === "list" ? "active" : ""}
                      onClick={() => setLayout("list")}
                    >
                      <List size={18} />
                    </button>
                  </div>
                </div>
                <div className="level-filter">
                  <span>YOUR LEVEL</span>
                  <div className="level-pills">
                    {["All levels", ...LEVELS].map((l) => (
                      <button
                        key={l}
                        aria-pressed={level === l}
                        className={level === l ? "active" : ""}
                        onClick={() => setLevel(l)}
                      >
                        {l}
                        {l !== "All levels" && (
                          <span>
                            {levelNames[l as keyof typeof levelNames]}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="results-caption">
                  <span>
                    {query || level !== "All levels" || topic !== "All topics"
                      ? `${filtered.length} matching sets`
                      : page === "sets"
                        ? "A home for the words that matter to you"
                        : "Curated for curious minds, at every level"}
                  </span>
                  <span>
                    ENGLISH <span className="tiny-arrow">↔</span> VIETNAMESE
                  </span>
                </div>
                {filtered.length ? (
                  <div
                    className={`deck-grid ${layout === "list" ? "list-view" : ""}`}
                  >
                    {filtered.map((d) => (
                      <DeckCard
                        key={d.id}
                        deck={d}
                        progress={state.progress}
                        saved={state.bookmarks.includes(d.id)}
                        onSave={() => bookmark(d)}
                        onStudy={() => study(d)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <BookOpen size={36} />
                    <h3>
                      {page === "sets" && !myDecks.length
                        ? "Your collection starts here."
                        : "No sets found just yet."}
                    </h3>
                    <p>
                      {page === "sets" && !myDecks.length
                        ? "Bookmark a library set, prepare a lesson, or bring your own words."
                        : "Try another search or choose a different level."}
                    </p>
                    <button
                      className="button secondary"
                      onClick={() => {
                        if (page === "sets" && !myDecks.length)
                          navigate("library");
                        else {
                          setQuery("");
                          setLevel("All levels");
                          setTopic("All topics");
                          setMyTab("all");
                        }
                      }}
                    >
                      {page === "sets" && !myDecks.length
                        ? "Explore the library"
                        : "Clear filters"}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </section>
              {page === "library" && (
                <section className="teacher-banner">
                  <span className="teacher-icon">
                    <GraduationCap size={27} />
                  </span>
                  <div>
                    <h3>A little less prep. A little more teaching.</h3>
                    <p>
                      Pick a level and create a vocabulary set that fits your
                      students.
                    </p>
                  </div>
                  <button
                    className="button secondary"
                    onClick={() => navigate("prepare")}
                  >
                    Prepare a lesson
                    <ArrowRight size={16} />
                  </button>
                </section>
              )}
              <footer className="page-footer">
                <span>
                  <Leaf size={14} /> Made for steady growth, at your own pace.
                </span>
                <span>
                  <Monitor size={14} /> Saved on this device
                </span>
              </footer>
            </>
          )}
        </main>
      </div>
      {importOpen && (
        <ImportDialog onClose={() => setImportOpen(false)} onSave={saveDeck} />
      )}
      {helpOpen && (
        <Modal
          title="A little help along the way."
          subtitle="Make yourself at home in Lexi."
          onClose={() => setHelpOpen(false)}
        >
          <div className="help-content">
            <p>
              <strong>Find your starting point.</strong> Browse the library by
              CEFR level, from A1 beginner to C2 proficient. These are suggested
              levels for practice.
            </p>
            <p>
              <strong>Make words stick.</strong> Open a set, tap a card to see
              its Vietnamese meaning, then choose “Got it!” or “Still learning.”
              Use Space to flip and the arrow keys to move when a button is not
              focused.
            </p>
            <p>
              <strong>Make it yours.</strong> Bookmark any set, import a CSV/TSV
              list, or select words in Prepare a lesson. Optional phonetics use
              the International Phonetic Alphabet (IPA).
            </p>
            <p>
              <strong>Your own learning space.</strong> Sets and progress stay
              in this browser. They are not synced across devices. Clearing
              browser data removes them. Export custom words from My sets to
              keep a copy.
            </p>
          </div>
          <button
            className="button primary full"
            onClick={() => setHelpOpen(false)}
          >
            Got it. Let’s grow. <ArrowRight size={16} />
          </button>
        </Modal>
      )}
      {toast && (
        <div role="status" className="toast">
          <Check size={18} />
          {toast}
        </div>
      )}
    </div>
  );
}
function Stat({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div className="stat">
      <span className={`stat-icon ${color}`}>{icon}</span>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}
function SproutDrawing() {
  return <Leaf size={28} strokeWidth={1.5} />;
}
function RepeatArrow() {
  return <span className="repeat-arrow">↔</span>;
}
