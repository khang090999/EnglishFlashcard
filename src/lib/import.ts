export type ImportedWord = {
	english: string;
	phonetic: string;
	vietnamese: string;
};
export function parseVocabulary(text: string): {
	words: ImportedWord[];
	errors: string[];
	duplicates: number;
} {
	const result: {
		words: ImportedWord[];
		errors: string[];
		duplicates: number;
	} = { words: [], errors: [], duplicates: 0 };
	if (text.length > 500000) {
		return { ...result, errors: ['Please keep imports under 500 KB.'] };
	}
	const source = text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
	if (!source.trim()) {
		return {
			...result,
			errors: ['Add at least one English word and its Vietnamese meaning.'],
		};
	}
	const delimiter = (source.split('\n').find((line) => line.trim()) || '').includes('\t') ? '\t' : ',';
	const rows: { cells: string[]; line: number }[] = [];
	let cells: string[] = [],
		field = '',
		quoted = false,
		closed = false,
		line = 1,
		rowLine = 1;
	for (let i = 0; i <= source.length; i++) {
		const c = source[i];
		if (quoted) {
			if (c === '"') {
				if (source[i + 1] === '"') {
					field += '"';
					i++;
				} else {
					quoted = false;
					closed = true;
				}
			} else if (c === undefined) {
				result.errors.push(`Row ${rowLine}: a closing quote is missing.`);
			} else {
				field += c;
				if (c === '\n') {
					line++;
				}
			}
		} else if (c === '"' && !field.trim() && !closed) {
			quoted = true;
			field = '';
		} else if (c === delimiter || c === '\n' || c === undefined) {
			cells.push(field.trim());
			field = '';
			closed = false;
			if (c !== delimiter) {
				if (cells.some(Boolean)) {
					rows.push({ cells, line: rowLine });
				}
				cells = [];
				line++;
				rowLine = line;
			}
		} else if (closed && c.trim()) {
			result.errors.push(`Row ${rowLine}: unexpected text after a closing quote.`);
		} else {
			field += c;
		}
	}
	const first = rows[0]?.cells.map((c) => c.toLowerCase());
	if (
		first &&
		['english', 'word', 'term'].includes(first[0]) &&
		first.some((c) => ['vietnamese', 'meaning', 'translation'].includes(c))
	) {
		rows.shift();
	}
	if (rows.length > 1000) {
		return { ...result, errors: ['Import up to 1,000 words at a time.'] };
	}
	const seen = new Set<string>();
	for (const row of rows) {
		if (row.cells.length !== 2 && row.cells.length !== 3) {
			result.errors.push(`Row ${row.line}: use 2 or 3 columns (English, optional phonetic, Vietnamese).`);
			continue;
		}
		const [english, second, third] = row.cells;
		const vietnamese = row.cells.length === 2 ? second : third;
		const phonetic = row.cells.length === 2 ? '' : second;
		if (!english || !vietnamese) {
			result.errors.push(`Row ${row.line}: English and Vietnamese are required.`);
			continue;
		}
		if (row.cells.some((c) => c.length > 500)) {
			result.errors.push(`Row ${row.line}: each field must be 500 characters or fewer.`);
			continue;
		}
		const key = english.toLocaleLowerCase('en').normalize('NFC');
		if (seen.has(key)) {
			result.duplicates++;
			continue;
		}
		seen.add(key);
		result.words.push({ english, phonetic, vietnamese });
	}
	if (!result.words.length && !result.errors.length) {
		result.errors.push('No vocabulary found. Add words below the header.');
	}
	return result;
}
