// Keyword extraction utilities
export class KeywordExtractor {
  private stopWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
    'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'with', 'will'
  ]);

  extractKeywords(text: string): any {
    const words = this.extractWords(text);
    const phrases = this.extractPhrases(text);
    
    return {
      technical: this.extractTechnicalKeywords(words),
      soft_skills: this.extractSoftSkills(words),
      industry_terms: this.extractIndustryTerms(words),
      action_verbs: this.extractActionVerbs(words),
      density: this.calculateKeywordDensity(words),
      top_keywords: this.getTopKeywords(words),
      phrases: phrases.slice(0, 20)
    };
  }

  generateIndustryKeywords(industry: string, role: string): any {
    const keywordMap: Record<string, { technical: string[]; soft_skills: string[]; industry_terms: string[] }> = {
      'technology': {
        technical: ['JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL', 'Git'],
        soft_skills: ['problem-solving', 'teamwork', 'communication', 'leadership', 'analytical thinking'],
        industry_terms: ['software development', 'agile', 'scrum', 'DevOps', 'cloud computing', 'microservices']
      },
      'marketing': {
        technical: ['Google Analytics', 'SEO', 'SEM', 'CRM', 'HubSpot', 'Salesforce', 'Adobe Creative Suite'],
        soft_skills: ['creativity', 'communication', 'analytical thinking', 'project management'],
        industry_terms: ['digital marketing', 'content marketing', 'social media', 'brand management', 'campaign optimization']
      },
      'finance': {
        technical: ['Excel', 'Bloomberg', 'SAP', 'QuickBooks', 'Tableau', 'SQL', 'Python', 'R'],
        soft_skills: ['analytical thinking', 'attention to detail', 'communication', 'problem-solving'],
        industry_terms: ['financial analysis', 'risk management', 'portfolio management', 'financial modeling', 'compliance']
      },
      'healthcare': {
        technical: ['EMR', 'HIPAA', 'Epic', 'Cerner', 'medical terminology', 'clinical research'],
        soft_skills: ['empathy', 'communication', 'attention to detail', 'teamwork', 'problem-solving'],
        industry_terms: ['patient care', 'clinical excellence', 'healthcare administration', 'medical records']
      }
    };

    const defaultKeywords = {
      technical: ['Microsoft Office', 'project management', 'data analysis', 'communication'],
      soft_skills: ['leadership', 'teamwork', 'communication', 'problem-solving', 'analytical thinking'],
      industry_terms: ['professional development', 'process improvement', 'stakeholder management']
    };

    return keywordMap[industry.toLowerCase()] || defaultKeywords;
  }

  private extractWords(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !this.stopWords.has(word));
  }

  private extractPhrases(text: string): string[] {
    const words = text.toLowerCase().split(/\s+/);
    const phrases = [];
    
    for (let i = 0; i < words.length - 1; i++) {
      if (!this.stopWords.has(words[i]) && !this.stopWords.has(words[i + 1])) {
        phrases.push(`${words[i]} ${words[i + 1]}`);
      }
    }
    
    return [...new Set(phrases)];
  }

  private extractTechnicalKeywords(words: string[]): string[] {
    const technicalTerms = [
      'javascript', 'python', 'react', 'nodejs', 'aws', 'docker', 'kubernetes',
      'mongodb', 'postgresql', 'git', 'api', 'rest', 'graphql', 'sql',
      'html', 'css', 'typescript', 'vue', 'angular', 'express', 'django',
      'machine learning', 'artificial intelligence', 'data science', 'analytics'
    ];
    
    return words.filter(word => technicalTerms.includes(word));
  }

  private extractSoftSkills(words: string[]): string[] {
    const softSkills = [
      'leadership', 'communication', 'teamwork', 'problem-solving',
      'analytical', 'creative', 'innovative', 'strategic', 'collaborative',
      'adaptable', 'organized', 'detail-oriented', 'proactive'
    ];
    
    return words.filter(word => softSkills.includes(word));
  }

  private extractIndustryTerms(words: string[]): string[] {
    const industryTerms = [
      'agile', 'scrum', 'devops', 'cloud', 'microservices', 'automation',
      'digital', 'transformation', 'innovation', 'optimization', 'scalability',
      'security', 'compliance', 'governance', 'architecture'
    ];
    
    return words.filter(word => industryTerms.includes(word));
  }

  private extractActionVerbs(words: string[]): string[] {
    const actionVerbs = [
      'led', 'managed', 'developed', 'implemented', 'created', 'designed',
      'built', 'optimized', 'improved', 'achieved', 'delivered', 'coordinated',
      'facilitated', 'analyzed', 'researched', 'established', 'launched'
    ];
    
    return words.filter(word => actionVerbs.includes(word));
  }

  private calculateKeywordDensity(words: string[]): number {
    const uniqueWords = new Set(words);
    return words.length > 0 ? uniqueWords.size / words.length : 0;
  }

  private getTopKeywords(words: string[]): { word: string; count: number }[] {
    const wordCount = new Map<string, number>();
    
    for (const word of words) {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    }
    
    return Array.from(wordCount.entries())
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
}