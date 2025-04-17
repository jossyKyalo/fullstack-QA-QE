import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

// Interfaces based on your database schema
export interface User {
  user_id: number;
  email: string;
  full_name: string;
  user_type: 'job_seeker' | 'recruiter' | 'admin';
  created_at: string;
  last_login: string;
}

export interface JobSeeker {
  jobseeker_id: number;
  user_id: number;
  headline: string;
  current_company: string;
  years_experience: number;
  remote_preference: boolean;
}

export interface Company {
  company_id: number;
  company_name: string;
  location: string;
  industry: string;
  description: string;
}

export interface Skill {
  skill_id: number;
  skill_name: string;
  category: 'technical' | 'soft' | 'other';
  description: string;
}

export interface UserSkill {
  user_skill_id: number | null;
  user_id: number | null;
  skill_id: number | null;
  skill_name: string; // Joined field
  category: string; // Joined field
  proficiency_score: number;
  verified: boolean;
  assessment_date: string | null;
}

export interface Job {
  job_id: number;
  company_id: number;
  company_name: string; // Joined field
  title: string | null;
  description: string;
  location: string;
  remote_option: boolean;
  employment_type: 'full-time' | 'contract' | 'part-time' | 'internship';
  created_at: string;
  status: 'active' | 'filled' | 'closed';
  match_score?: number; // From matches table
  applied?: boolean; // From applications table
  required_skills?: SkillRequirement[]; // From jobskills table
}

export interface SkillRequirement {
  skill_id: number;
  skill_name: string;
  importance_level: number;
}

export interface Application {
  application_id: number;
  job_id: number;
  jobseeker_id: number;
  status: 'applied' | 'reviewed' | 'interviewed' | 'rejected' | 'hired';
  applied_date: string;
  match_score: number;
  notes: string;
}

export interface Match {
  match_id: number;
  job_id: number;
  jobseeker_id: number;
  match_score: number;
  generated_date: string;
  status: 'pending' | 'contacted' | 'responded';
}

export interface Assessment {
  assessment_id: number;
  user_id: number;
  assessment_type: string;
  score: number;
  completed_date: string;
  validity_period: number;
}

export interface EmploymentPreference {
  preference_id: number;
  jobseeker_id: number;
  employment_type: 'full-time' | 'contract' | 'part-time' | 'internship';
}

export interface ResumeAnalysis {
  jobseeker_id: number;
  resume_uploaded: boolean;
  keyword_optimization: number| null;
  industry_alignment: string | null;
  extracted_skills: UserSkill[];
  improvement_suggestions: string[];
  last_updated: string;
  fileName: string;
}

@Injectable({
  providedIn: 'root'
})
export class JobSeekerDbService {
  private apiUrl = 'https://your-api-endpoint.com/api';
  private currentUserId: number | null = null;
  private currentJobseekerId: number | null = null;
  
  constructor(private http: HttpClient) {
    // In a real app, you would get these from an auth service
    this.getCurrentUser().subscribe(user => {
      if (user) {
        this.currentUserId = user.user_id;
        this.getJobSeekerProfile(user.user_id).subscribe(profile => {
          if (profile) {
            this.currentJobseekerId = profile.jobseeker_id;
          }
        });
      }
    });
  }

  // Get current logged in user
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/current`)
      .pipe(
        catchError(error => {
          console.error('Error fetching current user:', error);
          // Return mock data if API call fails
          return of(this.getMockUser());
        })
      );
  }

  // Get job seeker profile from user_id
  getJobSeekerProfile(userId: number): Observable<JobSeeker> {
    return this.http.get<JobSeeker>(`${this.apiUrl}/jobseekers/by-user/${userId}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching job seeker profile:', error);
          return of(this.getMockJobSeeker(userId));
        })
      );
  }

  // Get job seeker skills with proficiency
  getJobSeekerSkills(userId: number): Observable<UserSkill[]> {
    return this.http.get<UserSkill[]>(`${this.apiUrl}/skills/user/${userId}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching job seeker skills:', error);
          return of(this.getMockUserSkills(userId));
        })
      );
  }

  // Get employment preferences
  getEmploymentPreferences(jobseekerId: number): Observable<EmploymentPreference[]> {
    return this.http.get<EmploymentPreference[]>(`${this.apiUrl}/preferences/jobseeker/${jobseekerId}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching employment preferences:', error);
          return of(this.getMockEmploymentPreferences(jobseekerId));
        })
      );
  }

  // Get job matches from AI
  getJobMatches(jobseekerId: number): Observable<Job[]> {
    return this.http.get<Match[]>(`${this.apiUrl}/matches/jobseeker/${jobseekerId}`)
      .pipe(
        switchMap(matches => {
          const jobIds = matches.map(match => match.job_id);
          
          // Fetch job details for all matched jobs
          return this.http.post<Job[]>(`${this.apiUrl}/jobs/by-ids`, { jobIds })
            .pipe(
              map(jobs => {
                // Add match score to each job
                return jobs.map(job => {
                  const match = matches.find(m => m.job_id === job.job_id);
                  return {
                    ...job,
                    match_score: match ? match.match_score : 0
                  };
                })
                .sort((a, b) => (b.match_score ?? 0) - (a.match_score ?? 0)); // Sort by match score
              }),
              catchError(error => {
                console.error('Error fetching job details:', error);
                return of([]);
              })
            );
        }),
        catchError(error => {
          console.error('Error fetching job matches:', error);
          return of(this.getMockJobMatches());
        })
      );
  }

  // Get job application status
  getJobApplications(jobseekerId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/applications/jobseeker/${jobseekerId}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching job applications:', error);
          return of([]);
        })
      );
  }

  // Get resume analysis data
  getResumeAnalysis(jobseekerId: number): Observable<ResumeAnalysis> {
    return this.http.get<ResumeAnalysis>(`${this.apiUrl}/resume/analysis/${jobseekerId}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching resume analysis:', error);
          return of(this.getMockResumeAnalysis(jobseekerId));
        })
      );
  }

  // Submit a job application
  applyForJob(jobId: number, jobseekerId: number): Observable<{success: boolean, message: string}> {
    return this.http.post<{success: boolean, message: string}>(`${this.apiUrl}/applications/apply`, {
      job_id: jobId,
      jobseeker_id: jobseekerId
    }).pipe(
      catchError(error => {
        console.error('Error applying for job:', error);
        return of({ success: false, message: 'Failed to apply. Please try again later.' });
      })
    );
  }

  // Schedule a new skills assessment
  scheduleAssessment(userId: number, assessmentType: string): Observable<{assessmentUrl: string}> {
    return this.http.post<{assessmentUrl: string}>(`${this.apiUrl}/assessments/schedule`, {
      user_id: userId,
      assessment_type: assessmentType
    }).pipe(
      catchError(error => {
        console.error('Error scheduling assessment:', error);
        return of({ assessmentUrl: '/mock-assessment' });
      })
    );
  }

  // Upload a new resume
  uploadResume(jobseekerId: number, resumeFile: File): Observable<ResumeAnalysis> {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobseeker_id', jobseekerId.toString());
    
    return this.http.post<ResumeAnalysis>(`${this.apiUrl}/resume/upload`, formData)
      .pipe(
        catchError(error => {
          console.error('Error uploading resume:', error);
          return of(this.getMockResumeAnalysis(jobseekerId));
        })
      );
  }

  // Get complete dashboard data
  getDashboardData(userId: number): Observable<{
    profile: JobSeeker,
    skills: UserSkill[],
    matches: Job[],
    applications: Application[],
    resume: ResumeAnalysis,
    preferences: EmploymentPreference[]
  }> {
    return this.getJobSeekerProfile(userId).pipe(
      switchMap(profile => {
        if (!profile) {
          throw new Error('Job seeker profile not found');
        }
        
        return forkJoin({
          profile: of(profile),
          skills: this.getJobSeekerSkills(userId),
          matches: this.getJobMatches(profile.jobseeker_id),
          applications: this.getJobApplications(profile.jobseeker_id),
          resume: this.getResumeAnalysis(profile.jobseeker_id),
          preferences: this.getEmploymentPreferences(profile.jobseeker_id)
        });
      }),
      catchError(error => {
        console.error('Error loading dashboard data:', error);
        return of({
          profile: this.getMockJobSeeker(userId),
          skills: this.getMockUserSkills(userId),
          matches: this.getMockJobMatches(),
          applications: [],
          resume: this.getMockResumeAnalysis(1), // Mock jobseeker_id
          preferences: this.getMockEmploymentPreferences(1) // Mock jobseeker_id
        });
      })
    );
  }

  // Generate new AI job recommendations
  regenerateJobMatches(jobseekerId: number): Observable<Job[]> {
    return this.http.post<Job[]>(`${this.apiUrl}/ai/generate-matches`, { jobseeker_id: jobseekerId })
      .pipe(
        catchError(error => {
          console.error('Error regenerating job matches:', error);
          return of(this.getMockJobMatches());
        })
      );
  }

  // Mock data for fallback scenarios
  private getMockUser(): User {
    return {
      user_id: 1,
      email: 'johndoe@example.com',
      full_name: 'John Doe',
      user_type: 'job_seeker',
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString()
    };
  }

  private getMockJobSeeker(userId: number): JobSeeker {
    return {
      jobseeker_id: 1,
      user_id: userId,
      headline: 'Experienced Frontend Developer',
      current_company: 'Tech Innovations',
      years_experience: 5,
      remote_preference: true
    };
  }

  private getMockUserSkills(userId: number): UserSkill[] {
    return [
      {
        user_skill_id: 1,
        user_id: userId,
        skill_id: 1,
        skill_name: 'JavaScript',
        category: 'technical',
        proficiency_score: 90,
        verified: true,
        assessment_date: new Date().toISOString()
      },
      {
        user_skill_id: 2,
        user_id: userId,
        skill_id: 2,
        skill_name: 'React',
        category: 'technical',
        proficiency_score: 85,
        verified: true,
        assessment_date: new Date().toISOString()
      },
      {
        user_skill_id: 3,
        user_id: userId,
        skill_id: 3,
        skill_name: 'Angular',
        category: 'technical',
        proficiency_score: 75,
        verified: false,
        assessment_date: new Date().toISOString()
      },
      {
        user_skill_id: 4,
        user_id: userId,
        skill_id: 4,
        skill_name: 'Communication',
        category: 'soft',
        proficiency_score: 95,
        verified: false,
        assessment_date: null
      }
    ];
  }

  private getMockJobMatches(): Job[] {
    return [
      {
        job_id: 101,
        company_id: 201,
        company_name: 'Rafted Technologies',
        title: 'Senior Frontend Developer',
        description: 'We\'re looking for an experienced frontend developer to join our team. Must have strong skills in modern JavaScript frameworks.',
        location: 'Nairobi',
        remote_option: true,
        employment_type: 'full-time',
        created_at: new Date().toISOString(),
        status: 'active',
        match_score: 95,
        required_skills: [
          { skill_id: 1, skill_name: 'JavaScript', importance_level: 5 },
          { skill_id: 2, skill_name: 'React', importance_level: 4 },
          { skill_id: 5, skill_name: 'CSS', importance_level: 3 }
        ]
      },
      {
        job_id: 102,
        company_id: 202,
        company_name: 'DesignHub',
        title: 'UI/UX Designer',
        description: 'Join our creative team to design intuitive and beautiful interfaces for our clients.',
        location: 'Remote',
        remote_option: true,
        employment_type: 'contract',
        created_at: new Date().toISOString(),
        status: 'active',
        match_score: 87,
        required_skills: [
          { skill_id: 6, skill_name: 'Figma', importance_level: 5 },
          { skill_id: 7, skill_name: 'UI Design', importance_level: 5 },
          { skill_id: 8, skill_name: 'User Research', importance_level: 4 }
        ]
      },
      {
        job_id: 103,
        company_id: 203,
        company_name: 'Microsoft',
        title: 'Product Manager',
        description: 'Lead product development for our Africa initiatives.',
        location: 'Kenya',
        remote_option: false,
        employment_type: 'full-time',
        created_at: new Date().toISOString(),
        status: 'active',
        match_score: 82,
        required_skills: [
          { skill_id: 9, skill_name: 'Product Management', importance_level: 5 },
          { skill_id: 10, skill_name: 'Agile', importance_level: 4 },
          { skill_id: 11, skill_name: 'Market Research', importance_level: 4 }
        ]
      }
    ];
  }

  private getMockResumeAnalysis(jobseekerId: number): ResumeAnalysis {
    return {
      jobseeker_id: jobseekerId,
      resume_uploaded: true,
      fileName: 'resume.pdf', 
      keyword_optimization: 87,
      industry_alignment: 'High',
      extracted_skills: this.getMockUserSkills(1),
      improvement_suggestions: [
        'Add more specific project outcomes and metrics',
        'Include certifications section',
        'Expand on leadership experiences'
      ],
      last_updated: new Date().toISOString()
    };
  }

  private getMockEmploymentPreferences(jobseekerId: number): EmploymentPreference[] {
    return [
      {
        preference_id: 1,
        jobseeker_id: jobseekerId,
        employment_type: 'full-time'
      },
      {
        preference_id: 2,
        jobseeker_id: jobseekerId,
        employment_type: 'contract'
      }
    ];
  }
}