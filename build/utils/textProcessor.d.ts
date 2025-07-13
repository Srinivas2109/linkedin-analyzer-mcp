export declare class TextProcessor {
    cleanText(text: string): string;
    extractSentences(text: string): string[];
    extractWords(text: string): string[];
    calculateReadability(text: string): number;
    private countSyllables;
    private countWordSyllables;
    extractPhrases(text: string, minLength?: number): string[];
}
//# sourceMappingURL=textProcessor.d.ts.map