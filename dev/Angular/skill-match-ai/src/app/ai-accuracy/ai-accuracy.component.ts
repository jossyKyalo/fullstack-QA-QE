import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, RouterModule, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

interface MetricCard {
  name: string;
  value: string;
}

interface AccuracyIssue {
  type: string;
  count: number;
  color: string;
  trend?: string;  
}
interface NavItem {
  name: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-ai-accuracy',
  templateUrl: './ai-accuracy.component.html',
  imports: [CommonModule],
  styleUrls: ['./ai-accuracy.component.css']
})
export class AIAccuracyComponent implements OnInit {
  metrics: MetricCard[] = [
    { name: 'Accuracy', value: '94.8%' },
    { name: 'Precision', value: '89.2%' },
    { name: 'Recall', value: '91.2%' },
    { name: 'F1 Score', value: '90.2%' }
  ];
  currentRoute: string = '';
  
  navItems: NavItem[] = [
    { name: 'Dashboard', icon: 'fa-tachometer-alt', route: '/users' },
    { name: 'User Management', icon: 'fa-users', route: '/users' },
    { name: 'Security', icon: 'fa-shield-alt', route: '/security' },
    { name: 'AI Accuracy', icon: 'fa-brain', route: '/ai-accuracy' },
    { name: 'System Performance', icon: 'fa-chart-line', route: '/systemPerformance' }
  ];
  constructor(private router: Router) {
    // Keep track of the current route to highlight the active nav item
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.url;
    });
    
    // Set initial route
    this.currentRoute = this.router.url;
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }

  accuracyRating: string = 'Excellent';
  
  // Sample data for weekly trend
  weeklyTrend: number[] = [87, 89, 90, 92, 93, 94, 95];

  issues: AccuracyIssue[] = [
    { type: 'False Positive', count: 23, color: 'green', trend: 'down' },
    { type: 'False Negative', count: 18, color: 'red', trend: 'up' },
    { type: 'Classification Error', count: 12, color: 'orange' }
  ];


  ngOnInit(): void {
  }
}
