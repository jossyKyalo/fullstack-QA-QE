import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  async getMetrics(): Promise<any> {
    return this.http.get(`${this.apiUrl}/metrics`).toPromise();
  }

  async getUsers(page: number = 1, limit: number = 10): Promise<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&limit=${limit}`).toPromise();
  }

  async createUser(userData: any): Promise<any> {
    return this.http.post(this.apiUrl, userData).toPromise();
  }

  async updateUser(userId: string, userData: any): Promise<any> {
    return this.http.put(`${this.apiUrl}/${userId}`, userData).toPromise();
  }

  async deleteUser(userId: string): Promise<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`).toPromise();
  }
}
