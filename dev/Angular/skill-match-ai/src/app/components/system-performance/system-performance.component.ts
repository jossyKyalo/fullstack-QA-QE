import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SystemPerformanceService, SystemMetrics, ServerMetrics } from '../../services/system-performance.service';
import { Subscription, interval } from 'rxjs';

interface PerformanceMetric {
  name: string;
  value: string;
  status: 'good' | 'warning' | 'critical';
  change?: string;
}

interface NavItem {
  name: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-system-performance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './system-performance.component.html',
  styleUrls: ['./system-performance.component.css']
})
export class SystemPerformanceComponent implements OnInit, OnDestroy {
  currentRoute: string = '';
  private metricsSubscription?: Subscription;
  isLoading = true;
  error: string | null = null;
  
  navItems: NavItem[] = [
    { name: 'Dashboard', icon: 'fa-tachometer-alt', route: '/users' },
    { name: 'User Management', icon: 'fa-users', route: '/users' },
    { name: 'Security', icon: 'fa-shield-alt', route: '/security' },
    { name: 'AI Accuracy', icon: 'fa-brain', route: '/ai-accuracy' },
    { name: 'System Performance', icon: 'fa-chart-line', route: '/systemPerformance' }
  ];

  performanceMetrics: PerformanceMetric[] = [];
  cpuHistory: number[] = [];
  memoryHistory: number[] = [];
  serverStatuses: {
    name: string;
    status: 'online' | 'offline' | 'degraded';
    uptime: string;
    load: number;
  }[] = [];

  constructor(
    private router: Router,
    private systemService: SystemPerformanceService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
    });
    
    this.currentRoute = this.router.url;
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.setupMetricsPolling();
  }

  ngOnDestroy(): void {
    if (this.metricsSubscription) {
      this.metricsSubscription.unsubscribe();
    }
  }
  refreshData(): void {
    this.isLoading = true;
    
    // Reload all the data
    Promise.all([
      this.systemService.getSystemMetrics().toPromise(),
      this.systemService.getHistoricalMetrics().toPromise(),
      this.systemService.getServerStatuses().toPromise()
    ]).then(([metrics, historical, servers]) => {
      // Update metrics
      if (metrics) {
        this.updateMetricsDisplay(metrics);
      }
      
      // Update historical data
      if (historical) {
        this.cpuHistory = historical.cpu || [];
        this.memoryHistory = historical.memory || [];
      }
      
      // Update server statuses
      if (servers) {
        this.serverStatuses = (servers || []).map(server => ({
          name: server.name,
          status: server.status,
          uptime: this.systemService.formatUptime(server.uptime),
          load: server.load
        }));
      }
      
      this.error = null;
      this.isLoading = false;
    }).catch(error => {
      console.error('Error refreshing data:', error);
      this.error = 'Failed to refresh data';
      this.isLoading = false;
    });
  }

  private updateMetricsDisplay(metrics: any): void {
    this.performanceMetrics = [
      {
        name: 'CPU Usage',
        value: `${metrics.cpu.usage}%`,
        status: this.getMetricStatus(metrics.cpu.usage),
        change: `${metrics.cpu.change > 0 ? '+' : ''}${metrics.cpu.change}%`
      },
      {
        name: 'Memory Usage',
        value: `${metrics.memory.usage}%`,
        status: this.getMetricStatus(metrics.memory.usage),
        change: `${metrics.memory.change > 0 ? '+' : ''}${metrics.memory.change}%`
      },
      {
        name: 'Disk Space',
        value: `${metrics.disk.usage}%`,
        status: this.getMetricStatus(metrics.disk.usage),
        change: `${metrics.disk.change > 0 ? '+' : ''}${metrics.disk.change}%`
      },
      {
        name: 'Response Time',
        value: `${metrics.responseTime.value}ms`,
        status: this.getResponseTimeStatus(metrics.responseTime.value),
        change: `${metrics.responseTime.change > 0 ? '+' : ''}${metrics.responseTime.change}ms`
      }
    ];
  }

  private async loadInitialData() {
    try {
      this.isLoading = true;
      
      // Load historical data
      const historical = await this.systemService.getHistoricalMetrics().toPromise();
      this.cpuHistory = historical?.cpu|| [];
      this.memoryHistory = historical?.memory|| [];

      // Load server statuses
      const servers = await this.systemService.getServerStatuses().toPromise();
      console.log('Server statuses:', servers);
      this.serverStatuses = (servers??[]).map(server => ({
        name: server.name,
        status: server.status,
        uptime: this.systemService.formatUptime(server.uptime),
        load: server.load
      }));

      this.error = null;
    } catch (err) {
      this.error = 'Failed to load system performance data';
      console.error('Error loading data:', err);
    } finally {
      this.isLoading = false;
    }
  }

  private setupMetricsPolling() {
    // Poll metrics every 30 seconds
    this.metricsSubscription = interval(30000).subscribe(() => {
      this.updateMetrics();
    });
    
    // Initial metrics load
    this.updateMetrics();
  }

  private async updateMetrics() {
    try {
      const metrics = await this.systemService.getSystemMetrics().toPromise();
      if (!metrics) {
        console.warn('Metrics data is undefined');
        return;
      }
      this.performanceMetrics = [
        {
          name: 'CPU Usage',
          value: `${metrics.cpu.usage}%`,
          status: this.getMetricStatus(metrics.cpu.usage),
          change: `${metrics.cpu.change > 0 ? '+' : ''}${metrics.cpu.change}%`
        },
        {
          name: 'Memory Usage',
          value: `${metrics.memory.usage}%`,
          status: this.getMetricStatus(metrics.memory.usage),
          change: `${metrics.memory.change > 0 ? '+' : ''}${metrics.memory.change}%`
        },
        {
          name: 'Disk Space',
          value: `${metrics.disk.usage}%`,
          status: this.getMetricStatus(metrics.disk.usage),
          change: `${metrics.disk.change > 0 ? '+' : ''}${metrics.disk.change}%`
        },
        {
          name: 'Response Time',
          value: `${metrics.responseTime.value}ms`,
          status: this.getResponseTimeStatus(metrics.responseTime.value),
          change: `${metrics.responseTime.change > 0 ? '+' : ''}${metrics.responseTime.change}ms`
        }
      ];
    } catch (err) {
      console.error('Error updating metrics:', err);
    }
  }

  private getMetricStatus(value: number): 'good' | 'warning' | 'critical' {
    if (value < 70) return 'good';
    if (value < 90) return 'warning';
    return 'critical';
  }

  private getResponseTimeStatus(value: number): 'good' | 'warning' | 'critical' {
    if (value < 300) return 'good';
    if (value < 500) return 'warning';
    return 'critical';
  }

  navigate(route: string) {
    this.router.navigate([route]);
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

    if (!this.cpuHistory || this.cpuHistory.length < 2) {
      return '';
    }
    
    return this.cpuHistory
      .map((val, i) => {
        const x = i * (700 / Math.max(1, this.cpuHistory.length - 1));
        const y = 200 - (isNaN(val) ? 0 : val) * 2;
        return `${x},${y}`;
      })
      .join(' ');
  }
  
  get memoryPolylinePoints(): string {
    if (!this.memoryHistory || this.memoryHistory.length < 2) {
      return '';
    }
    
    return this.memoryHistory
      .map((val, i) => {
        const x = i * (700 / Math.max(1, this.memoryHistory.length - 1));
        const y = 200 - (isNaN(val) ? 0 : val) * 2;
        return `${x},${y}`;
      })
      .join(' ');
  }
}