import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class RecruiterService {
  private apiUrl = `${environment.apiUrl}/recruiters`; 

  constructor(private http: HttpClient) {}

  getProfile(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/profile`);
  }

  getMetrics(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/metrics`);
  }

  getActiveJobs(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/jobs/active`);
  }

  getCandidateMatches(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/candidates/matches`);
  }

  createJob(jobData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/jobs`, jobData);
  }

  searchCandidates(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/candidates/search?query=${query}`);
  }

  contactCandidate(message: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/candidates/contact`, message);
  }
}
