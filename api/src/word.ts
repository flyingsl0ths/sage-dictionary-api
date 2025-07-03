export type Word = {
	readonly word: string;
	readonly pronounciation: string;
	readonly definition: string;
	readonly synonyms: string[];
	readonly antonyms: string[];
	readonly sentences: string[];
};

// biome-ignore lint: lint/suspicious/noExplicitAny
export function parseWord(word: any): Word | null {
	const meanings = word.meanings;

	if (!meanings || meanings.length === 0) {
		return null;
	}

	const phonestics = word.phonetics;

	if (!phonestics || phonestics.length === 0) {
		return null;
	}

	return {
		word: word.word,
		pronounciation: word.phonetic ?? findPhonetic(word.phonetics),
		definition: meanings[0].definitions[0].definition,
		synonyms: meanings[0].synonyms,
		antonyms: meanings[0].antonyms,
		sentences: extractExamples(meanings),
	};
}

// biome-ignore lint: lint/suspicious/noExplicitAny
function findPhonetic(phonoetics: any[]): string {
	if (phonoetics.length === 0) return "";

	let result = "";
	for (const ph of phonoetics) {
		if (ph.text) {
			result = ph.text;
			break;
		}
	}

	return result;
}

// biome-ignore lint: lint/suspicious/noExplicitAny
function extractExamples(meanings: any[]): string[] {
	const examples: string[] = [];
	for (const meaning of meanings) {
		for (const definition of meaning.definitions) {
			if (definition.example) {
				examples.push(definition.example);
			}
		}
	}
	return examples;
}
