import { test } from "node:test";
import assert from "node:assert/strict";
import { parseVocabulary } from "../src/lib/import.ts";

test("imports BOM headers, quoted Vietnamese commas, and IPA", () => {
  const result = parseVocabulary(
    '\uFEFFenglish,phonetic,vietnamese\r\napple,/ˈæp.əl/,"quả táo, trái táo"',
  );
  assert.equal(result.words[0]?.vietnamese, "quả táo, trái táo");
  assert.equal(result.words[0]?.phonetic, "/ˈæp.əl/");
  assert.deepEqual(result.errors, []);
});
test("supports two-column TSV and ignores blank lines", () => {
  const result = parseVocabulary("hello\txin chào\n\nthank you\tcảm ơn");
  assert.equal(result.words.length, 2);
  assert.equal(result.words[1].english, "thank you");
});
test("reports missing translations and duplicate words", () => {
  const result = parseVocabulary("apple,/a/,táo\nAPPLE,/a/,táo\nwrong,/w/,");
  assert.equal(result.words.length, 1);
  assert.equal(result.duplicates, 1);
  assert.match(result.errors[0], /3.*Vietnamese/i);
});
test("rejects broken quoting instead of silently truncating", () => {
  assert.ok(parseVocabulary('apple,/a/,"unclosed').errors.length);
});
test("supports escaped quotes and quoted multiline CSV", () => {
  const result = parseVocabulary('word,/w/,"say ""hello""\nagain"');
  assert.equal(result.words[0]?.vietnamese, 'say "hello"\nagain');
});
test("empty and oversized import have useful errors", () => {
  assert.ok(parseVocabulary("").errors.length);
  assert.ok(parseVocabulary("a".repeat(500001)).errors.length);
});
test("preserves empty boundary TSV columns and rejects missing required fields", () => {
  assert.ok(
    parseVocabulary("english\tphonetic\tvietnamese\nhello\t/həˈləʊ/\t").errors
      .length,
  );
  assert.ok(parseVocabulary("\t/həˈləʊ/\txin chào").errors.length);
});
