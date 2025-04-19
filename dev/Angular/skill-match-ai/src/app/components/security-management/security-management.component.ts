// security-management.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

interface Role {
  id: number;
  name: string;
  tags: string[];
  permissions: number;
}
interface NavItem {
  name: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-security-management',
  imports: [ CommonModule],
  templateUrl: './security-management.component.html',
  styleUrls: ['./security-management.component.css']
})
export class SecurityManagementComponent implements OnInit {
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
  activeTab: string = 'roles';
  roles: Role[] = [
    { id: 1, name: 'Super Admin', tags: ['all'], permissions: 1 },
    { id: 2, name: 'Security Admin', tags: ['security', 'monitoring'], permissions: 2 },
    { id: 3, name: 'User Admin', tags: ['user_management'], permissions: 1 },
    { id: 4, name: 'AI Admin', tags: ['ai_accuracy'], permissions: 3 }
  ];


  ngOnInit(): void {
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  addNewRole(): void {
    // Implement logic to add a new role
    console.log('Add new role clicked');
  }
}
