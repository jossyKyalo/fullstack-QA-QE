import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface User {
  id: number;
  initials: string;
  name: string;
  email: string;
  role: 'Job Seeker' | 'Recruiter' | 'Admin';
  status: 'Active' | 'Pending';
  color?: string;
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  title = 'JobPortal';
  adminInitials = 'JP';
  currentNavItem = 'User Management';
  
  metrics = {
    totalUsers: {
      count: 4829,
      growth: 12
    },
    jobSeekers: {
      count: 3541,
      growth: 18
    },
    recruiters: {
      count: 1275,
      growth: 8
    }
  };
  
  // Navigation items
  navItems = [
    { name: 'Dashboard', icon: 'dashboard' },
    { name: 'User Management', icon: 'people' },
    { name: 'Security', icon: 'shield' },
    { name: 'AI Accuracy', icon: 'analytics' },
    { name: 'System Performance', icon: 'speed' }
  ];
  
  // Tab options
  tabs = ['All Users', 'Job Seekers', 'Recruiters', 'Admins'];
  activeTab = 'All Users';
  
  // Users data
  users: User[] = [
    { id: 1, initials: 'JS', name: 'James Smith', email: 'james@example.com', role: 'Job Seeker', status: 'Active', color: '#2196F3' },
    { id: 2, initials: 'SR', name: 'Sarah Roberts', email: 'sarah@company.com', role: 'Recruiter', status: 'Active', color: '#FF5722' },
    { id: 3, initials: 'MJ', name: 'Mike Johnson', email: 'mike@admin.com', role: 'Admin', status: 'Active', color: '#9C27B0' },
    { id: 4, initials: 'AR', name: 'Alex Rivera', email: 'alex@example.com', role: 'Job Seeker', status: 'Pending', color: '#4CAF50' }
  ];
  
  // Pagination
  currentPage = 1;
  totalPages = 3;
  
  // Methods
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  navigateTo(item: string): void {
    this.currentNavItem = item;
  }
  
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  
  getRoleClass(role: string): string {
    switch(role) {
      case 'Job Seeker': return 'job-seeker-role';
      case 'Recruiter': return 'recruiter-role';
      case 'Admin': return 'admin-role';
      default: return '';
    }
  }
  
  getStatusClass(status: string): string {
    return status === 'Active' ? 'active-status' : 'pending-status';
  }
  
  addUser(): void {
    console.log('Adding new user');
    // Implementation  
  }
  
  editUser(userId: number): void {
    console.log('Editing user with ID:', userId);
    // Implementation  
  }
  
  searchUsers(event: any): void {
    console.log('Searching for:', event.target.value);
    // Implementation  
  }
}