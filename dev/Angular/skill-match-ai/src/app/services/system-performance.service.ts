import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

export interface DiskDetail {
  mount: string;
  type: string;
  usedPercent: number;
  total: number;
  used: number;
  free: number;
}

export interface SystemMetrics {
  cpu: {
    usage: number;
    change: number;
  };
  memory: {
    usage: number;
    change: number;
  };
  disk: {
    usage: number;
    change: number;
    details: DiskDetail[];
  };
  responseTime: {
    value: number;
    change: number;
  };
}

export interface ServerMetrics {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  uptime: number; // in seconds
  load: number;
}

@Injectable({
  providedIn: 'root'
})
export class SystemPerformanceService {
  private apiUrl = `${environment.apiUrl}/system`;

  constructor(private http: HttpClient) { }

  getSystemMetrics(): Observable<SystemMetrics> {
    return this.http.get<SystemMetrics>(`${this.apiUrl}/metrics`);
  }

  getHistoricalMetrics(days: number = 7): Observable<{
    cpu: number[];
    memory: number[];
  }> {
    return this.http.get<{ cpu: number[]; memory: number[] }>(
      `${this.apiUrl}/historical?days=${days}`
    );
  }

  getServerStatuses(): Observable<ServerMetrics[]> {
    return this.http.get<ServerMetrics[]>(`${this.apiUrl}/servers`);
  }

  formatUptime(seconds: number): string {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  }

  formatBytes(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${Math.round(size * 100) / 100} ${units[unitIndex]}`;
  }
}
