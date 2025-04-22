import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class AiAssistantService {
  private apiUrl = `${environment.apiUrl}/ai-assistant`;

  constructor(private http: HttpClient) {}

  // Get AI-suggested candidates for a specific job
  getSuggestedCandidates(jobId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/jobs/${jobId}/candidates`);
  }

  // Get AI-suggested jobs for a specific candidate
  getSuggestedJobs(candidateId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/candidates/${candidateId}/jobs`);
  }

  // Generate an AI-powered job description based on skills and requirements
  generateJobDescription(jobRequirements: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/generate-job-description`, jobRequirements);
  }

  // Analyze a candidate's resume and extract skills
  analyzeResume(resumeData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/analyze-resume`, resumeData);
  }

  // Get match score explanation between job and candidate
  getMatchExplanation(jobId: number, candidateId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/match-explanation/${jobId}/${candidateId}`);
  }
  
  // Generate customized interview questions based on job and candidate profile
  generateInterviewQuestions(jobId: number, candidateId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/generate-interview-questions/${jobId}/${candidateId}`);
  }
}