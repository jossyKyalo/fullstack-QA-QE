import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }
  
  saveOnboardingData(data: any): Observable<any> {
    const token = localStorage.getItem('auth_token');
    console.log('Actual token value:', token);
    
    // Use FormData for mixed content
    const formData = this.prepareFormData(data);
    
    // Manual headers to ensure they're set correctly
    const options = {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    };
    
    return this.http.post(`${this.apiUrl}/onboarding`, formData, options)
      .pipe(
        tap(response => console.log('Onboarding API response:', response)),
        catchError(error => {
          console.error('Onboarding API error:', error);
          if (error.status === 401) {
            console.error('Authentication token might be invalid or expired');
          }
          return throwError(error);
        })
      );
  }
   
  getSkillSuggestions(searchTerm: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/skills/search?term=${searchTerm}`)
      .pipe(
        catchError(error => {
          console.error('Skill search error:', error);
          return throwError(error);
        })
      );
  }

  extractSkillsFromResume(resumeFile: File): Observable<any[]> {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    
    return this.http.post<any[]>(`${this.apiUrl}/skills/extract`, formData)
      .pipe(
        tap(response => console.log('Skill extraction response:', response)),
        catchError(error => {
          console.error('Skill extraction error:', error);
          return throwError(error);
        })
      );
  }

  private prepareFormData(data: any): FormData {
    // Convert data to FormData to handle file uploads
    const formData = new FormData();
    
    // Add profile data
    formData.append('headline', data.profile.headline || '');
    formData.append('currentCompany', data.profile.currentCompany || '');
    formData.append('yearsExperience', String(data.profile.yearsExperience || 0));
    
    // Add profile photo if exists
    if (data.profilePhoto) {
      formData.append('profilePhoto', data.profilePhoto);
    }
    
    // Add skills data - ensure it's a properly formatted JSON string
    formData.append('skills', JSON.stringify(data.skills || []));
    
    // Add resume file if exists
    if (data.resume) {
      formData.append('resume', data.resume);
    }
    
    // Add preferences data
    formData.append('preferredLocation', data.preferences?.location || '');
    formData.append('remotePreference', String(data.preferences?.remotePreference || false));
    
    // Add employment types
    const employmentTypes = [];
    if (data.preferences?.fullTime) employmentTypes.push('full-time');
    if (data.preferences?.partTime) employmentTypes.push('part-time');
    if (data.preferences?.contract) employmentTypes.push('contract');
    if (data.preferences?.internship) employmentTypes.push('internship');
    formData.append('employmentTypes', JSON.stringify(employmentTypes));
    
    // Log the form data keys to verify content
    console.log('FormData keys:', Array.from(formData.keys()));
    
    return formData;
  }
}