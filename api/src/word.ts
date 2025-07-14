export type Word = {
	readonly word: string;
	readonly phonetics: string;
	readonly definition: string;
	readonly synonyms: string[];
	readonly antonyms: string[];
	readonly sentences: Map<string, string[]>;
};

// biome-ignore lint: lint/suspicious/noExplicitAny
export function parseWord(word: any): Word | null {
	const meanings = word.meanings;

	if (!meanings || meanings.length === 0) {
		return null;
	}

	const phonetics = word.phonetics;

	if (!phonetics || phonetics.length === 0) {
		return null;
	}

	return {
		word: word.word,
		phonetics: word.phonetic ?? findPhonetics(word.phonetics),
		definition: meanings[0].definitions[0].definition,
		synonyms: meanings[0].synonyms,
		antonyms: meanings[0].antonyms,
		sentences: extractExamples(meanings),
	};
}

// biome-ignore lint: lint/suspicious/noExplicitAny
function findPhonetics(phonoetics: any[]): string {
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
function extractExamples(meanings: any[]): Map<string, string[]> {
	const examples: Map<string, string[]> = new Map();
	for (const meaning of meanings) {
		for (const definition of meaning.definitions) {
			if (definition.example) {
				const partOfSpeech = examples.get(meaning.partOfSpeech);
				if (partOfSpeech) {
					partOfSpeech.push(definition.example);
				} else {
					examples.set(meaning.partOfSpeech, [definition.example]);
				}
			}
		}
	}

	return examples;
}
