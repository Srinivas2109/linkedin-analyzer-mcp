// Compare resumes
export class ResumeComparer {
  compare(profileText: string, resumeText: string): string {
    const profileSections = this.extractProfileSections(profileText);
    const resumeSections = this.extractResumeSections(resumeText);
    
    const comparison = {
      alignment_score: this.calculateAlignmentScore(profileSections, resumeSections),
      missing_from_profile: this.findMissingFromProfile(profileSections, resumeSections),
      missing_from_resume: this.findMissingFromResume(profileSections, resumeSections),
      consistency_issues: this.findConsistencyIssues(profileSections, resumeSections),
      recommendations: this.generateAlignmentRecommendations(profileSections, resumeSections)
    };

    return JSON.stringify(comparison, null, 2);
  }

  private extractProfileSections(text: string) {
    return {
      skills: this.extractSkillsFromText(text),
      experience: this.extractExperienceFromText(text),
      education: this.extractEducationFromText(text),
      certifications: this.extractCertificationsFromText(text),
      projects: this.extractProjectsFromText(text)
    };
  }

  private extractResumeSections(text: string) {
    return {
      skills: this.extractSkillsFromText(text),
      experience: this.extractExperienceFromText(text),
      education: this.extractEducationFromText(text),
      certifications: this.extractCertificationsFromText(text),
      projects: this.extractProjectsFromText(text)
    };
  }

  private extractSkillsFromText(text: string): string[] {
    const skillKeywords = ['skills', 'technologies', 'tools', 'proficient'];
    const skills = [];
    const lines = text.split('\n');

    for (const line of lines) {
      if (skillKeywords.some(keyword => line.toLowerCase().includes(keyword))) {
        const skillList = line.split(/[,;|]/).map(s => s.trim()).filter(s => s.length > 2);
        skills.push(...skillList);
      }
    }

    return skills;
  }

  private extractExperienceFromText(text: string): string[] {
    const experienceKeywords = ['experience', 'work', 'employment', 'position'];
    const experiences = [];
    const lines = text.split('\n');

    for (const line of lines) {
      if (experienceKeywords.some(keyword => line.toLowerCase().includes(keyword))) {
        experiences.push(line.trim());
      }
    }

    return experiences;
  }

  private extractEducationFromText(text: string): string[] {
    const educationKeywords = ['education', 'degree', 'university', 'college'];
    const education = [];
    const lines = text.split('\n');

    for (const line of lines) {
      if (educationKeywords.some(keyword => line.toLowerCase().includes(keyword))) {
        education.push(line.trim());
      }
    }

    return education;
  }

  private extractCertificationsFromText(text: string): string[] {
    const certKeywords = ['certification', 'certificate', 'certified'];
    const certifications = [];
    const lines = text.split('\n');

    for (const line of lines) {
      if (certKeywords.some(keyword => line.toLowerCase().includes(keyword))) {
        certifications.push(line.trim());
      }
    }

    return certifications;
  }

  private extractProjectsFromText(text: string): string[] {
    const projectKeywords = ['project', 'built', 'developed', 'created'];
    const projects = [];
    const lines = text.split('\n');

    for (const line of lines) {
      if (projectKeywords.some(keyword => line.toLowerCase().includes(keyword))) {
        projects.push(line.trim());
      }
    }

    return projects;
  }

  private calculateAlignmentScore(profileSections: any, resumeSections: any): number {
    let score = 0;
    let totalSections = 0;

    const sections = ['skills', 'experience', 'education', 'certifications', 'projects'];
    
    for (const section of sections) {
      totalSections++;
      const profileItems = profileSections[section] || [];
      const resumeItems = resumeSections[section] || [];
      
      if (profileItems.length > 0 && resumeItems.length > 0) {
        const overlap = this.calculateOverlap(profileItems, resumeItems);
        score += overlap;
      }
    }

    return Math.round((score / totalSections) * 100);
  }

  private calculateOverlap(array1: string[], array2: string[]): number {
    const set1 = new Set(array1.map(item => item.toLowerCase()));
    const set2 = new Set(array2.map(item => item.toLowerCase()));
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  private findMissingFromProfile(profileSections: any, resumeSections: any): Record<string, string[]> {
    const missing: Record<string, string[]> = {};
    for (const section of ['skills', 'experience', 'education', 'certifications', 'projects']) {
      const profileItems = new Set((profileSections[section] || []).map((item: string) => item.toLowerCase()));
      const resumeItems = resumeSections[section] || [];
      missing[section] = resumeItems.filter((item: string) => !profileItems.has(item.toLowerCase()));
    }
    return missing;
  }

  private findMissingFromResume(profileSections: any, resumeSections: any): Record<string, string[]> {
    const missing: Record<string, string[]> = {};
    for (const section of ['skills', 'experience', 'education', 'certifications', 'projects']) {
      const resumeItems = new Set((resumeSections[section] || []).map((item: string) => item.toLowerCase()));
      const profileItems = profileSections[section] || [];
      missing[section] = profileItems.filter((item: string) => !resumeItems.has(item.toLowerCase()));
    }
    return missing;
  }

  private findConsistencyIssues(profileSections: any, resumeSections: any): string[] {
    const issues = [];
    
    // Check for date inconsistencies
    const profileExperience = profileSections.experience.join(' ').toLowerCase();
    const resumeExperience = resumeSections.experience.join(' ').toLowerCase();
    
    if (profileExperience.includes('current') && !resumeExperience.includes('current')) {
      issues.push('Current position status inconsistent between profile and resume');
    }
    
    // Check for education inconsistencies
    const profileEducation = profileSections.education.join(' ').toLowerCase();
    const resumeEducation = resumeSections.education.join(' ').toLowerCase();
    
    if (profileEducation.length > 0 && resumeEducation.length > 0) {
      if (!this.hasCommonEducation(profileEducation, resumeEducation)) {
        issues.push('Education information differs between profile and resume');
      }
    }
    
    // Check for skill level inconsistencies
    const profileSkills = profileSections.skills;
    const resumeSkills = resumeSections.skills;
    
    if (profileSkills.length > resumeSkills.length * 2) {
      issues.push('LinkedIn profile has significantly more skills than resume - consider consolidating');
    }
    
    return issues;
  }

  private hasCommonEducation(profileEducation: string, resumeEducation: string): boolean {
    const commonTerms = ['university', 'college', 'bachelor', 'master', 'phd', 'degree'];
    
    for (const term of commonTerms) {
      if (profileEducation.includes(term) && resumeEducation.includes(term)) {
        return true;
      }
    }
    
    return false;
  }

  private generateAlignmentRecommendations(profileSections: any, resumeSections: any): string[] {
    const recommendations = [];
    
    const missingFromProfile = this.findMissingFromProfile(profileSections, resumeSections);
    const missingFromResume = this.findMissingFromResume(profileSections, resumeSections);
    
    // Profile recommendations
    if (missingFromProfile.skills.length > 0) {
      recommendations.push(`Add these skills to your LinkedIn profile: ${missingFromProfile.skills.slice(0, 5).join(', ')}`);
    }
    
    if (missingFromProfile.certifications.length > 0) {
      recommendations.push(`Add certifications from your resume to your LinkedIn profile`);
    }
    
    if (missingFromProfile.projects.length > 0) {
      recommendations.push(`Include project details from your resume in your LinkedIn profile`);
    }
    
    // Resume recommendations
    if (missingFromResume.skills.length > 0) {
      recommendations.push(`Consider adding these LinkedIn skills to your resume: ${missingFromResume.skills.slice(0, 5).join(', ')}`);
    }
    
    // General alignment recommendations
    recommendations.push('Ensure job titles and company names match exactly between both documents');
    recommendations.push('Use consistent date formats across both profile and resume');
    recommendations.push('Align the tone and language style between both documents');
    recommendations.push('Cross-reference achievements to ensure they appear in both documents');
    
    return recommendations;
  }
}