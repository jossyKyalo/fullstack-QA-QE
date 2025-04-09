import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface PerformanceMetric {
  name: string;
  value: string;
  status: 'good' | 'warning' | 'critical';
  change?: string;
}

interface ServerStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  uptime: string;
  load: number;
}

@Component({
  selector: 'app-system-performance',
  imports: [CommonModule],
  templateUrl: './system-performance.component.html',
  styleUrls: ['./system-performance.component.css']
})
export class SystemPerformanceComponent implements OnInit {
  performanceMetrics: PerformanceMetric[] = [
    { name: 'CPU Usage', value: '42%', status: 'good', change: '-3%' },
    { name: 'Memory Usage', value: '68%', status: 'warning', change: '+5%' },
    { name: 'Disk Space', value: '37%', status: 'good', change: '+2%' },
    { name: 'Response Time', value: '235ms', status: 'good', change: '-12ms' }
  ];

  cpuHistory: number[] = [35, 42, 38, 45, 40, 48, 42];
  memoryHistory: number[] = [60, 58, 62, 65, 63, 70, 68];
  
  serverStatuses: ServerStatus[] = [
    { name: 'Application Server', status: 'online', uptime: '12d 7h 32m', load: 68 },
    { name: 'Database Server', status: 'online', uptime: '23d 14h 12m', load: 45 },
    { name: 'Job Queue Server', status: 'degraded', uptime: '3d 22h 45m', load: 92 },
    { name: 'Analytics Server', status: 'online', uptime: '16d 3h 51m', load: 30 }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  getStatusColor(status: 'online' | 'offline' | 'degraded'): string {
    switch(status) {
      case 'online': return '#4caf50';
      case 'offline': return '#f44336';
      case 'degraded': return '#ff9800';
      default: return '#999';
    }
  }

  getMetricStatusColor(status: 'good' | 'warning' | 'critical'): string {
    switch(status) {
      case 'good': return '#4caf50';
      case 'warning': return '#ff9800';
      case 'critical': return '#f44336';
      default: return '#999';
    }
  }
  get cpuPolylinePoints(): string {
    return this.cpuHistory
      .map((val, i) => `${i * (700 / (this.cpuHistory.length - 1))},${200 - val * 2}`)
      .join(' ');
  }
  
  get memoryPolylinePoints(): string {
    return this.memoryHistory
      .map((val, i) => `${i * (700 / (this.memoryHistory.length - 1))},${200 - val * 2}`)
      .join(' ');
  }
  
}
