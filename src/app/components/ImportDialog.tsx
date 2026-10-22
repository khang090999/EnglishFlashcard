import { createDeckId } from "@/lib/id";
import { useMemo, useRef, useState } from "react";
import {
  Upload,
  FileText,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Download,
} from "lucide-react";
import { LEVELS, type Deck, type Level } from "@/lib/types";
import { parseVocabulary } from "@/lib/import";
import { Modal } from "./Modal";
const sample =
  "english,phonetic,vietnamese\ncurious,/ˈkjʊə.ri.əs/,tò mò\njourney,/ˈdʒɜː.ni/,hành trình\nbloom,/bluːm/,nở hoa";
export function ImportDialog({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (deck: Deck) => void;
}) {
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState<Level>("A1");
  const [text, setText] = useState("");
  const [fileError, setFileError] = useState("");
  const [preview, setPreview] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const parsed = useMemo(() => parseVocabulary(text), [text]);
  function save() {
    if (!title.trim() || !parsed.words.length || parsed.errors.length) return;
    const id = createDeckId(globalThis.crypto);
    onSave({
      id,
      title: title.trim(),
      description: "A little collection, made by you.",
      level,
      topic: "My vocabulary",
      color: "purple",
      icon: "book",
      custom: true,
      words: parsed.words.map((w, i) => ({ ...w, id: `${id}-${i}` })),
    });
  }
  return (
    <Modal
      title="Your words, your way."
      subtitle="Turn your vocabulary list into a set of flashcards."
      onClose={onClose}
      wide
    >
      <div className="form-row">
        <label>
          Set name
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
            placeholder="e.g. This week’s new words"
            autoFocus
          />
        </label>
        <label>
          Level
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as Level)}
          >
            {LEVELS.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </label>
      </div>
      <input
        ref={input}
        type="file"
        accept=".csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain"
        hidden
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setFileError("");
          if (file.size > 500000) {
            setFileError("Please choose a file smaller than 500 KB.");
            return;
          }
          try {
            setText(await file.text());
            setPreview(false);
            if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
          } catch {
            setFileError(
              "We could not read this file. Try pasting its content below.",
            );
          }
          e.target.value = "";
        }}
      />
      <button className="upload-zone" onClick={() => input.current?.click()}>
        <span className="upload-icon">
          <Upload size={24} />
        </span>
        <strong>Choose a vocabulary file</strong>
        <span>CSV, TSV, or TXT · up to 500 KB</span>
      </button>
      <div className="import-label">
        <label htmlFor="vocab-text">Or paste your words</label>
        <button
          className="text-button"
          onClick={() => {
            setText(sample);
            setPreview(false);
          }}
        >
          Try an example <FileText size={14} />
        </button>
      </div>
      <p className="field-help">
        One word per line: English, phonetic, Vietnamese. Phonetics are
        optional. You can also paste two or three columns from a spreadsheet.
      </p>
      <textarea
        id="vocab-text"
        rows={6}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setPreview(false);
        }}
        placeholder={"hello,/həˈləʊ/,xin chào\nfriend,/frend/,bạn bè"}
        spellCheck={false}
      />
      {fileError && (
        <p className="error" role="alert">
          {fileError}
        </p>
      )}
      {preview && (
        <div className="import-preview">
          {parsed.errors.length > 0 && (
            <div className="error-box" role="alert">
              <strong>
                <AlertCircle size={17} /> A few things to fix
              </strong>
              {parsed.errors.slice(0, 5).map((e, i) => (
                <p key={i}>{e}</p>
              ))}
              {parsed.errors.length > 5 && (
                <p>And {parsed.errors.length - 5} more errors.</p>
              )}
            </div>
          )}
          {parsed.words.length > 0 && (
            <>
              <div className="preview-heading">
                <CheckCircle2 size={17} />
                {parsed.words.length} words ready
                {parsed.duplicates > 0 &&
                  ` · ${parsed.duplicates} duplicate${parsed.duplicates > 1 ? "s" : ""} skipped`}
              </div>
              <div className="preview-rows">
                {parsed.words.slice(0, 5).map((w, i) => (
                  <div key={i}>
                    <strong>{w.english}</strong>
                    <span>{w.phonetic || "—"}</span>
                    <span lang="vi">{w.vietnamese}</span>
                  </div>
                ))}
              </div>
              {parsed.words.length > 5 && (
                <p className="field-help">
                  And {parsed.words.length - 5} more words in your set.
                </p>
              )}
            </>
          )}
        </div>
      )}
      <div className="modal-footer">
        <a
          className="text-button"
          href={`data:text/csv;charset=utf-8,${encodeURIComponent("\uFEFF" + sample)}`}
          download="lexi-vocabulary-template.csv"
        >
          <Download size={15} /> CSV template
        </a>
        {preview && !parsed.errors.length ? (
          <button
            className="button primary"
            disabled={!title.trim() || !parsed.words.length}
            onClick={save}
          >
            Create study set <ArrowRight size={17} />
          </button>
        ) : (
          <button
            className="button primary"
            disabled={!text.trim()}
            onClick={() => setPreview(true)}
          >
            Preview words <ArrowRight size={17} />
          </button>
        )}
      </div>
    </Modal>
  );
}
