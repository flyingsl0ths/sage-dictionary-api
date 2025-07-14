export type Word = {
	readonly word: string;
	readonly phonetics: string;
	readonly definition: string;
	readonly synonyms: string[];
	readonly antonyms: string[];
	readonly sentences: { [k: string]: string[] };
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
		sentences: Object.fromEntries(extractExamples(meanings)),
	};
}

// biome-ignore lint: lint/suspicious/noExplicitAny
function findPhonetics(phonoetics: any[]): string {
	if (phonoetics.length === 0) return "";

	let result = "";
	for (const phonetic of phonoetics) {
		if (phonetic.text) {
			result = phonetic.text;
			break;
		}
	}

	return result;
}

// biome-ignore lint: lint/suspicious/noExplicitAny
function extractExamples(meanings: any[]): Map<string, string[]> {
	const examples: Map<string, string[]> = new Map();
	for (const meaning of meanings) {
		const partOfSpeech = meaning.partOfSpeech;

		if (!examples.has(partOfSpeech)) {
			examples.set(partOfSpeech, []);
		}

		for (const definition of meaning.definitions) {
			if (definition.example) {
				examples.get(meaning.partOfSpeech)?.push(definition.example);
			}
		}

		if (examples.get(partOfSpeech)?.length === 0) {
			examples.delete(partOfSpeech);
		}
	}

	return examples;
}
