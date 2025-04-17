import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';

interface Metrics {
  totalUsers: { count: number; growth: number };
  jobSeekers: { count: number; growth: number };
  recruiters: { count: number; growth: number };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Job Seeker' | 'Recruiter';
  status: 'Active' | 'Inactive' | 'Pending';
  initials: string;
  color: string;
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  title = 'SkillMatch AI';
  adminInitials = 'JD'; // This should come from logged-in admin
  currentNavItem = 'Users';
  activeTab = 'All Users';
  currentPage = 1;
  totalPages = 3;

  metrics: Metrics = {
    totalUsers: { count: 0, growth: 0 },
    jobSeekers: { count: 0, growth: 0 },
    recruiters: { count: 0, growth: 0 }
  };

  navItems = [
    { name: 'Dashboard', icon: 'dashboard-icon' },
    { name: 'Users', icon: 'users-icon' },
    { name: 'Settings', icon: 'settings-icon' }
  ];

  tabs = ['All Users', 'Job Seekers', 'Recruiters', 'Admins'];
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadMetrics();
    this.loadUsers();
  }

  async loadMetrics() {
    try {
      const metrics = await this.userService.getMetrics();
      this.metrics = metrics;
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  }

  async loadUsers(page: number = 1) {
    try {
      const response = await this.userService.getUsers(page);
      this.users = response.users;
      this.totalPages = response.totalPages;
      this.currentPage = page;
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }

  navigateTo(item: any) {
    this.currentNavItem = item.name;
  }

  addUser() {
    // Implement user addition logic
  }

  editUser(userId: string) {
    // Implement user editing logic
  }

  searchUsers(event: any) {
    const searchTerm = event.target.value;
    // Implement search logic
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.loadUsers(1); // Reset to first page when changing tabs
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.loadUsers(page);
    }
  }

  getRoleClass(role: string): string {
    return `role-badge ${role.toLowerCase().replace(' ', '-')}`;
  }

  getStatusClass(status: string): string {
    return `status-badge ${status.toLowerCase()}`;
  }
}