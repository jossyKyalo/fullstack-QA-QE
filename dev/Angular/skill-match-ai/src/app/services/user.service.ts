import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';
import { firstValueFrom } from 'rxjs';


interface UserResponse {
  users: User[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  initials: string;
  color: string;
}

export interface Metrics {
  totalUsers: { count: number; growth: number };
  jobSeekers: { count: number; growth: number };
  recruiters: { count: number; growth: number };
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  async getMetrics(): Promise<Metrics> {
    return await firstValueFrom(this.http.get<Metrics>(`${this.apiUrl}/metrics`, { withCredentials: true })) ;
  }

  async getUsers(page: number = 1, limit: number = 10, role?: string): Promise<UserResponse> {
    let url = `${this.apiUrl}?page=${page}&limit=${limit}`;
    if (role && role !== 'All Users') {
      url += `&role=${role}`;
    }
    return await firstValueFrom(this.http.get<UserResponse>(url, { withCredentials: true }));
  }

  async createUser(userData: {
    email: string;
    full_name: string;
    password: string;
    user_type: string;
  }): Promise<User> {
    return await firstValueFrom(this.http.post<User>(this.apiUrl, userData, { withCredentials: true }));
  }

  async updateUser(userId: string, userData: {
    email?: string;
    full_name?: string;
    user_type?: string;
  }): Promise<User> {
    return await firstValueFrom(this.http.put<User>(`${this.apiUrl}/${userId}`, userData, { withCredentials: true }));
  }

  async deleteUser(userId: string): Promise<{ message: string }> {
    return await firstValueFrom(this.http.delete<{ message: string }>(`${this.apiUrl}/${userId}`, { withCredentials: true }));
  }

  async searchUsers(searchTerm: string): Promise<UserResponse> {
    return await firstValueFrom(this.http.get<UserResponse>(`${this.apiUrl}/search?q=${searchTerm}`, { withCredentials: true }));
  }
}