// Analyze LinkedIn profiles
import { TextProcessor } from "../utils/textProcessor.js";
import { KeywordExtractor } from "../utils/keywordExtractor.js";
export class ProfileAnalyzer {
    constructor() {
        this.textProcessor = new TextProcessor();
        this.keywordExtractor = new KeywordExtractor();
    }
    analyze(profileText) {
        const sections = this.extractSections(profileText);
        const completeness = this.calculateCompleteness(sections);
        const keywords = this.keywordExtractor.extractKeywords(profileText);
        const strength = this.calculateStrength(sections, keywords);
        const recommendations = this.generateRecommendations(sections, completeness);
        const analysis = {
            profile_strength: strength,
            completeness_score: completeness,
            sections_analysis: sections,
            keyword_analysis: keywords,
            recommendations: recommendations,
            overall_assessment: this.generateOverallAssessment(strength, completeness)
        };
        return JSON.stringify(analysis, null, 2);
    }
    extractSections(text) {
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);
        return {
            headline: this.extractHeadline(lines),
            summary: this.extractSummary(lines),
            experience: this.extractExperience(lines),
            skills: this.extractSkills(lines),
            education: this.extractEducation(lines),
            certifications: this.extractCertifications(lines),
            projects: this.extractProjects(lines)
        };
    }
    extractHeadline(lines) {
        const headlineKeywords = ['headline', 'title', 'at ', ' | ', ' - '];
        let headline = '';
        for (const line of lines.slice(0, 5)) {
            if (headlineKeywords.some(keyword => line.toLowerCase().includes(keyword)) ||
                (line.length > 20 && line.length < 120 && !line.includes('.'))) {
                headline = line;
                break;
            }
        }
        return {
            content: headline || 'No clear headline found',
            quality: this.assessHeadlineQuality(headline)
        };
    }
    extractSummary(lines) {
        const summaryKeywords = ['about', 'summary', 'professional', 'experienced'];
        let summaryLines = [];
        let inSummary = false;
        for (const line of lines) {
            if (summaryKeywords.some(keyword => line.toLowerCase().includes(keyword))) {
                inSummary = true;
                continue;
            }
            if (inSummary && line.length > 50) {
                summaryLines.push(line);
            }
            if (inSummary && summaryLines.length > 0 && line.length < 20) {
                break;
            }
        }
        const summary = summaryLines.join(' ');
        return {
            content: summary || 'No summary found',
            quality: this.assessSummaryQuality(summary)
        };
    }
    extractExperience(lines) {
        const experienceKeywords = ['experience', 'work', 'position', 'role', 'company'];
        let experiences = [];
        let currentExp = '';
        for (const line of lines) {
            if (experienceKeywords.some(keyword => line.toLowerCase().includes(keyword))) {
                if (currentExp)
                    experiences.push(currentExp);
                currentExp = line;
            }
            else if (currentExp && line.length > 20) {
                currentExp += ' ' + line;
            }
        }
        if (currentExp)
            experiences.push(currentExp);
        return {
            content: experiences,
            quality: this.assessExperienceQuality(experiences)
        };
    }
    extractSkills(lines) {
        const skillKeywords = ['skills', 'proficient', 'technologies', 'tools'];
        let skills = [];
        for (const line of lines) {
            if (skillKeywords.some(keyword => line.toLowerCase().includes(keyword))) {
                const skillList = line.split(/[,;|]/).map(s => s.trim()).filter(s => s.length > 2);
                skills.push(...skillList);
            }
        }
        return {
            content: skills,
            quality: this.assessSkillsQuality(skills)
        };
    }
    extractEducation(lines) {
        const educationKeywords = ['education', 'university', 'college', 'degree', 'bachelor', 'master'];
        let education = [];
        for (const line of lines) {
            if (educationKeywords.some(keyword => line.toLowerCase().includes(keyword))) {
                education.push(line);
            }
        }
        return {
            content: education,
            quality: this.assessEducationQuality(education)
        };
    }
    extractCertifications(lines) {
        const certKeywords = ['certification', 'certificate', 'certified', 'license'];
        let certifications = [];
        for (const line of lines) {
            if (certKeywords.some(keyword => line.toLowerCase().includes(keyword))) {
                certifications.push(line);
            }
        }
        return {
            content: certifications,
            quality: this.assessCertificationsQuality(certifications)
        };
    }
    extractProjects(lines) {
        const projectKeywords = ['project', 'built', 'developed', 'created', 'implemented'];
        let projects = [];
        for (const line of lines) {
            if (projectKeywords.some(keyword => line.toLowerCase().includes(keyword))) {
                projects.push(line);
            }
        }
        return {
            content: projects,
            quality: this.assessProjectsQuality(projects)
        };
    }
    assessHeadlineQuality(headline) {
        if (!headline || headline === 'No clear headline found')
            return 'Poor - Missing headline';
        if (headline.length < 30)
            return 'Fair - Too short';
        if (headline.length > 120)
            return 'Fair - Too long';
        if (headline.includes('seeking') || headline.includes('looking'))
            return 'Poor - Sounds passive';
        return 'Good - Clear and professional';
    }
    assessSummaryQuality(summary) {
        if (!summary || summary === 'No summary found')
            return 'Poor - Missing summary';
        if (summary.length < 100)
            return 'Fair - Too brief';
        if (summary.length > 2000)
            return 'Fair - Too long';
        return 'Good - Comprehensive summary';
    }
    assessExperienceQuality(experiences) {
        if (experiences.length === 0)
            return 'Poor - No experience listed';
        if (experiences.length < 2)
            return 'Fair - Limited experience shown';
        return 'Good - Multiple experiences listed';
    }
    assessSkillsQuality(skills) {
        if (skills.length === 0)
            return 'Poor - No skills listed';
        if (skills.length < 5)
            return 'Fair - Limited skills shown';
        if (skills.length > 50)
            return 'Fair - Too many skills (diluted focus)';
        return 'Good - Balanced skills list';
    }
    assessEducationQuality(education) {
        if (education.length === 0)
            return 'Fair - No education listed';
        return 'Good - Education information present';
    }
    assessCertificationsQuality(certifications) {
        if (certifications.length === 0)
            return 'Fair - No certifications listed';
        return 'Good - Certifications present';
    }
    assessProjectsQuality(projects) {
        if (projects.length === 0)
            return 'Fair - No projects mentioned';
        return 'Good - Projects showcase work';
    }
    calculateCompleteness(sections) {
        let score = 0;
        const weights = {
            headline: 20,
            summary: 25,
            experience: 30,
            skills: 15,
            education: 10
        };
        if (sections.headline.content !== 'No clear headline found')
            score += weights.headline;
        if (sections.summary.content !== 'No summary found')
            score += weights.summary;
        if (sections.experience.content.length > 0)
            score += weights.experience;
        if (sections.skills.content.length > 0)
            score += weights.skills;
        if (sections.education.content.length > 0)
            score += weights.education;
        return score;
    }
    calculateStrength(sections, keywords) {
        let strength = 0;
        // Base completeness
        strength += this.calculateCompleteness(sections) * 0.4;
        // Keyword density
        strength += Math.min(keywords.density * 100, 30);
        // Content quality
        const qualityScores = Object.values(sections).map((section) => {
            if (section.quality?.includes('Good'))
                return 10;
            if (section.quality?.includes('Fair'))
                return 5;
            return 0;
        });
        strength += qualityScores.reduce((a, b) => a + b, 0) * 0.5;
        return Math.min(Math.round(strength), 100);
    }
    generateRecommendations(sections, completeness) {
        const recommendations = [];
        if (sections.headline.quality.includes('Poor') || sections.headline.quality.includes('Fair')) {
            recommendations.push('Improve headline: Make it more specific and value-focused');
        }
        if (sections.summary.quality.includes('Poor') || sections.summary.quality.includes('Fair')) {
            recommendations.push('Enhance summary: Add more details about achievements and value proposition');
        }
        if (sections.experience.content.length < 2) {
            recommendations.push('Add more experience: Include internships, projects, or volunteer work');
        }
        if (sections.skills.content.length < 5) {
            recommendations.push('Expand skills section: Add relevant technical and soft skills');
        }
        if (completeness < 70) {
            recommendations.push('Complete missing sections: Add education, certifications, or projects');
        }
        recommendations.push('Use action verbs and quantify achievements where possible');
        recommendations.push('Add industry-relevant keywords for better searchability');
        return recommendations;
    }
    generateOverallAssessment(strength, completeness) {
        if (strength >= 80 && completeness >= 80) {
            return 'Excellent profile with strong content and completeness';
        }
        else if (strength >= 60 && completeness >= 60) {
            return 'Good profile with room for improvement';
        }
        else if (strength >= 40 || completeness >= 40) {
            return 'Fair profile needing significant enhancements';
        }
        else {
            return 'Profile needs major improvements across multiple areas';
        }
    }
}
//# sourceMappingURL=profileAnalyzer.js.map