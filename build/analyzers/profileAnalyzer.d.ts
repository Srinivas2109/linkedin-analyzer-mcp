export declare class ProfileAnalyzer {
    private textProcessor;
    private keywordExtractor;
    constructor();
    analyze(profileText: string): string;
    private extractSections;
    private extractHeadline;
    private extractSummary;
    private extractExperience;
    private extractSkills;
    private extractEducation;
    private extractCertifications;
    private extractProjects;
    private assessHeadlineQuality;
    private assessSummaryQuality;
    private assessExperienceQuality;
    private assessSkillsQuality;
    private assessEducationQuality;
    private assessCertificationsQuality;
    private assessProjectsQuality;
    private calculateCompleteness;
    private calculateStrength;
    private generateRecommendations;
    private generateOverallAssessment;
}
//# sourceMappingURL=profileAnalyzer.d.ts.map