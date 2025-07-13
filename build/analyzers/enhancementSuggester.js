// Suggest profile enhancements
import { KeywordExtractor } from "../utils/keywordExtractor.js";
export class EnhancementSuggester {
    constructor() {
        this.keywordExtractor = new KeywordExtractor();
    }
    suggest(profileText, targetRole, experienceLevel) {
        const suggestions = {
            headline_improvements: this.suggestHeadlineImprovements(profileText, targetRole),
            summary_enhancements: this.suggestSummaryEnhancements(profileText, experienceLevel),
            experience_optimizations: this.suggestExperienceOptimizations(profileText),
            skills_recommendations: this.suggestSkillsImprovements(profileText, targetRole),
            keyword_optimization: this.suggestKeywordOptimization(profileText, targetRole),
            content_structure: this.suggestContentStructure(profileText),
            call_to_action: this.suggestCallToAction(targetRole, experienceLevel)
        };
        return JSON.stringify(suggestions, null, 2);
    }
    generateKeywords(profileText, industry, targetRole) {
        const keywords = this.keywordExtractor.generateIndustryKeywords(industry, targetRole);
        const currentKeywords = this.keywordExtractor.extractKeywords(profileText);
        const optimization = {
            current_keywords: currentKeywords,
            recommended_keywords: keywords,
            missing_keywords: keywords.technical.filter((k) => !currentKeywords.technical.includes(k)),
            integration_suggestions: this.suggestKeywordIntegration(keywords, profileText)
        };
        return JSON.stringify(optimization, null, 2);
    }
    suggestHeadlineImprovements(profileText, targetRole) {
        const suggestions = [];
        if (targetRole) {
            suggestions.push(`Include "${targetRole}" in your headline for clarity`);
        }
        suggestions.push('Add a value proposition: "Helping companies achieve X through Y"');
        suggestions.push('Include your top 2-3 skills or specializations');
        suggestions.push('Use keywords that recruiters search for in your industry');
        suggestions.push('Keep it under 120 characters for full visibility');
        suggestions.push('Avoid buzzwords like "guru," "ninja," or "rockstar"');
        return suggestions;
    }
    suggestSummaryEnhancements(profileText, experienceLevel) {
        const suggestions = [];
        if (experienceLevel === 'entry') {
            suggestions.push('Highlight relevant coursework, projects, and internships');
            suggestions.push('Emphasize transferable skills and learning agility');
            suggestions.push('Include academic achievements and extracurricular activities');
        }
        else if (experienceLevel === 'senior' || experienceLevel === 'executive') {
            suggestions.push('Lead with leadership experience and team management');
            suggestions.push('Quantify business impact and strategic contributions');
            suggestions.push('Mention industry recognition or thought leadership');
        }
        suggestions.push('Start with a compelling opening statement');
        suggestions.push('Use bullet points for key achievements');
        suggestions.push('Include specific metrics and results');
        suggestions.push('End with your career goals or what you\'re looking for');
        suggestions.push('Keep paragraphs short (3-4 lines max)');
        return suggestions;
    }
    suggestExperienceOptimizations(profileText) {
        return [
            'Use action verbs: "Led," "Developed," "Implemented," "Achieved"',
            'Quantify results: "Increased sales by 25%" instead of "Increased sales"',
            'Include 3-5 bullet points per role highlighting key achievements',
            'Focus on impact rather than just responsibilities',
            'Use keywords relevant to your target role',
            'Keep descriptions concise but comprehensive',
            'Show progression and growth in your career'
        ];
    }
    suggestSkillsImprovements(profileText, targetRole) {
        const suggestions = [
            'List 10-15 most relevant skills to avoid dilution',
            'Include both technical and soft skills',
            'Prioritize skills mentioned in job descriptions for your target role',
            'Get endorsements from colleagues for credibility',
            'Update skills regularly as you learn new ones'
        ];
        if (targetRole) {
            suggestions.push(`Research and add skills commonly required for ${targetRole} positions`);
        }
        return suggestions;
    }
    suggestKeywordOptimization(profileText, targetRole) {
        const suggestions = [
            'Research job descriptions for your target role to find common keywords',
            'Use industry-specific terminology naturally throughout your profile',
            'Include both acronyms and full terms (e.g., "AI" and "Artificial Intelligence")',
            'Add location-based keywords if targeting specific geographic areas',
            'Include skill variations (e.g., "JavaScript" and "JS")',
            'Use keywords in context rather than just listing them'
        ];
        if (targetRole) {
            suggestions.push(`Optimize for "${targetRole}" and related job titles`);
        }
        return suggestions;
    }
    suggestContentStructure(profileText) {
        return [
            'Use consistent formatting throughout your profile',
            'Include rich media (videos, presentations, documents) where relevant',
            'Add links to your portfolio, GitHub, or professional website',
            'Use LinkedIn\'s native video feature for personal branding',
            'Include relevant publications or articles you\'ve written',
            'Add volunteer experience to show well-roundedness',
            'Keep your profile updated with recent achievements'
        ];
    }
    suggestCallToAction(targetRole, experienceLevel) {
        const suggestions = [];
        if (experienceLevel === 'entry') {
            suggestions.push('End summary with: "I\'m excited to contribute to a dynamic team..."');
            suggestions.push('Mention openness to learning and growth opportunities');
        }
        else {
            suggestions.push('End summary with: "Let\'s connect to discuss how I can help..."');
            suggestions.push('Mention specific ways you can add value to organizations');
        }
        if (targetRole) {
            suggestions.push(`Include: "Seeking ${targetRole} opportunities in [industry/location]"`);
        }
        suggestions.push('Invite connections to reach out with opportunities');
        suggestions.push('Mention your availability for freelance/consulting work if applicable');
        return suggestions;
    }
    suggestKeywordIntegration(keywords, profileText) {
        return [
            'Integrate technical keywords naturally into your experience descriptions',
            'Use industry terms in your summary and headline',
            'Include soft skills keywords in context of achievements',
            'Add trending keywords for your industry',
            'Balance keyword density - don\'t overstuff',
            'Use variations of the same keyword throughout your profile'
        ];
    }
}
//# sourceMappingURL=enhancementSuggester.js.map