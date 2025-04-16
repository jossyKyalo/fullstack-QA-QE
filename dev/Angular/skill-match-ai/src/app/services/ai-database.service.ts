import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Job, UserSkill, SkillRequirement, Skill } from './job-seeker-db.service';

export interface ResumeParsingResult {
  extracted_skills: UserSkill[];
  suggested_skills: string[];
  experience_years: number;
  education: string[];
  job_titles: string[];
  industry_match: string;
  keyword_score: number;
}

export interface SkillGapAnalysis {
  job_id: number;
  missing_skills: {
    skill_id: number;
    skill_name: string;
    importance_level: number;
  }[];
  weak_skills: {
    skill_id: number;
    skill_name: string;
    current_level: number;
    required_level: number;
    gap: number;
  }[];
  strong_skills: {
    skill_id: number;
    skill_name: string;
    current_level: number;
    required_level: number;
    strength: number;
  }[];
  overall_match_percentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class AiDatabaseService {
  private aiApiUrl = 'https://your-ai-api-endpoint.com/api';
  
  constructor(private http: HttpClient) { }

  // Parse resume and extract skills, experience, etc.
  parseResume(resumeFile: File): Observable<ResumeParsingResult> {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    
    return this.http.post<ResumeParsingResult>(`${this.aiApiUrl}/resume/parse`, formData)
      .pipe(
        catchError(error => {
          console.error('Error parsing resume:', error);
          return of(this.getMockResumeParsingResult());
        })
      );
  }

  // Generate job recommendations based on user skills, preferences and resume
  generateJobRecommendations(jobseekerId: number): Observable<Job[]> {
    return this.http.post<Job[]>(`${this.aiApiUrl}/jobs/recommend`, { jobseeker_id: jobseekerId })
      .pipe(
        catchError(error => {
          console.error('Error generating job recommendations:', error);
          return of([]);
        })
      );
  }

  // Analyze skill gaps between user skills and job requirements
  analyzeSkillGap(userSkills: UserSkill[], jobId: number): Observable<SkillGapAnalysis> {
    return this.http.post<SkillGapAnalysis>(`${this.aiApiUrl}/skills/gap-analysis`, { 
      user_skills: userSkills,
      job_id: jobId
    }).pipe(
      catchError(error => {
        console.error('Error analyzing skill gap:', error);
        return of(this.getMockSkillGapAnalysis(jobId));
      })
    );
  }

  // Generate personalized suggestions to improve resume
  generateResumeSuggestions(jobseekerId: number, targetJobId?: number): Observable<string[]> {
    return this.http.post<string[]>(`${this.aiApiUrl}/resume/suggestions`, { 
      jobseeker_id: jobseekerId,
      target_job_id: targetJobId
    }).pipe(
      catchError(error => {
        console.error('Error generating resume suggestions:', error);
        return of([
          'Add measurable achievements to your work experience',
          'Include relevant certifications',
          'Focus more on skills that match your target job'
        ]);
      })
    );
  }

  // Find skills in the system that match user's experience but aren't in their profile
  suggestAdditionalSkills(userId: number): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.aiApiUrl}/skills/suggest-additional/${userId}`)
      .pipe(
        catchError(error => {
          console.error('Error suggesting additional skills:', error);
          return of([]);
        })
      );
  }

  // Mock data for fallback
  private getMockResumeParsingResult(): ResumeParsingResult {
    return {
      extracted_skills: [
        {
          user_skill_id:  null,
          user_id: null,
          skill_id: 1,
          skill_name: 'JavaScript',
          category: 'technical',
          proficiency_score: 90,
          verified: false,
          assessment_date: null
        },
        {
          user_skill_id: null,
          user_id: null,
          skill_id: 2,
          skill_name: 'React',
          category: 'technical',
          proficiency_score: 85,
          verified: false,
          assessment_date: null
        },
        {
          user_skill_id: null,
          user_id: null,
          skill_id: 3,
          skill_name: 'Angular',
          category: 'technical',
          proficiency_score: 80,
          verified: false,
          assessment_date: null
        }
      ],
      suggested_skills: ['TypeScript', 'Node.js', 'Redux'],
      experience_years: 5,
      education: ['Bachelor of Science in Computer Science', 'Web Development Certification'],
      job_titles: ['Frontend Developer', 'UI Developer', 'Web Developer'],
      industry_match: 'Technology',
      keyword_score: 87
    };
  }

  private getMockSkillGapAnalysis(jobId: number): SkillGapAnalysis {
    return {
      job_id: jobId,
      missing_skills: [
        {
          skill_id: 5,
          skill_name: 'GraphQL',
          importance_level: 4
        },
        {
          skill_id: 6,
          skill_name: 'AWS',
          importance_level: 3
        }
      ],
      weak_skills: [
        {
          skill_id: 3,
          skill_name: 'Angular',
          current_level: 75,
          required_level: 90,
          gap: 15
        }
      ],
      strong_skills: [
        {
          skill_id: 1,
          skill_name: 'JavaScript',
          current_level: 90,
          required_level: 85,
          strength: 5
        },
        {
          skill_id: 2,
          skill_name: 'React',
          current_level: 85,
          required_level: 80,
          strength: 5
        }
      ],
      overall_match_percentage: 78
    };
  }
}