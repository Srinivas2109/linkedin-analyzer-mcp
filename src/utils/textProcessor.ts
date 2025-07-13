// Text processing utilities
export class TextProcessor {
  cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s.,!?-]/g, '')
      .trim();
  }

  extractSentences(text: string): string[] {
    return text
      .split(/[.!?]+/)
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 0);
  }

  extractWords(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2);
  }

  calculateReadability(text: string): number {
    const sentences = this.extractSentences(text);
    const words = this.extractWords(text);
    const syllables = this.countSyllables(text);
    
    if (sentences.length === 0 || words.length === 0) return 0;
    
    // Flesch Reading Ease Score
    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;
    
    const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  private countSyllables(text: string): number {
    const words = this.extractWords(text);
    let syllableCount = 0;
    
    for (const word of words) {
      syllableCount += this.countWordSyllables(word);
    }
    
    return syllableCount;
  }

  private countWordSyllables(word: string): number {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    
    let count = 0;
    let previousWasVowel = false;
    
    for (let i = 0; i < word.length; i++) {
      const isVowel = 'aeiouy'.includes(word[i]);
      if (isVowel && !previousWasVowel) {
        count++;
      }
      previousWasVowel = isVowel;
    }
    
    if (word.endsWith('e')) count--;
    if (word.endsWith('le')) count++;
    
    return Math.max(1, count);
  }

  extractPhrases(text: string, minLength: number = 2): string[] {
    const words = this.extractWords(text);
    const phrases = [];
    
    for (let i = 0; i < words.length - minLength + 1; i++) {
      for (let j = minLength; j <= Math.min(4, words.length - i); j++) {
        phrases.push(words.slice(i, i + j).join(' '));
      }
    }
    
    return phrases;
  }
}
