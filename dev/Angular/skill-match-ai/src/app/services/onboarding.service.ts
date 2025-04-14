// onboarding.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  saveOnboardingData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/jobseekers/onboarding`, this.prepareFormData(data));
  }

  private prepareFormData(data: any): FormData {
    // Convert data to FormData to handle file uploads
    const formData = new FormData();
    
    // Add profile data
    formData.append('headline', data.profile.headline);
    formData.append('currentCompany', data.profile.currentCompany);
    formData.append('yearsExperience', data.profile.yearsExperience);
    
    // Add skills data
    formData.append('skills', JSON.stringify(data.skills));
    
    // Add resume file if exists
    if (data.resume) {
      formData.append('resume', data.resume);
    }
    
    // Add preferences data
    formData.append('location', data.preferences.location);
    formData.append('remotePreference', data.preferences.remotePreference);
    
    // Add employment types
    const employmentTypes = [];
    if (data.preferences.fullTime) employmentTypes.push('full-time');
    if (data.preferences.partTime) employmentTypes.push('part-time');
    if (data.preferences.contract) employmentTypes.push('contract');
    if (data.preferences.internship) employmentTypes.push('internship');
    formData.append('employmentTypes', JSON.stringify(employmentTypes));
    
    return formData;
  }

  // Method to get skill suggestions (would be used when typing in skill search)
  getSkillSuggestions(searchTerm: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/skills/search?term=${searchTerm}`);
  }

  // Method to extract skills from resume
  extractSkillsFromResume(resumeFile: File): Observable<any[]> {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    
    return this.http.post<any[]>(`${this.apiUrl}/skills/extract`, formData);
  }
}
