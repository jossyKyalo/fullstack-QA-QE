import { Component, OnInit } from '@angular/core';
import {User, Metrics, UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
 

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  title = 'SkillMatch AI';
  adminInitials = 'JD';
  currentNavItem = 'Users';
  activeTab = 'All Users';
  currentPage = 1;
  totalPages = 3;
  isLoading = false;
  error: string | null = null;

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
      this.isLoading = true;
      const metrics = await this.userService.getMetrics();
      this.metrics = metrics;
    } catch (error) {
      console.error('Error loading metrics:', error);
      this.error = 'Failed to load metrics';
    } finally {
      this.isLoading = false;
    }
  }

  async loadUsers(page: number = 1) {
    try {
      this.isLoading = true;
      const response = await this.userService.getUsers(page, 10, this.activeTab);
      this.users = response.users;
      this.totalPages = response.totalPages;
      this.currentPage = page;
    } catch (error) {
      console.error('Error loading users:', error);
      this.error = 'Failed to load users';
    } finally {
      this.isLoading = false;
    }
  }

  navigateTo(item: any) {
    this.currentNavItem = item.name;
  }

  async addUser() {
    // Will be implemented in a separate component
    console.log('Add user clicked');
  }

  async editUser(userId: string) {
    // Will be implemented in a separate component
    console.log('Edit user clicked:', userId);
  }

  async searchUsers(event: any) {
    const searchTerm = event.target.value;
    if (searchTerm.length >= 3) {
      try {
        const response = await this.userService.searchUsers(searchTerm);
        this.users = response.users;
        this.totalPages = response.totalPages;
        this.currentPage = 1;
      } catch (error) {
        console.error('Error searching users:', error);
      }
    } else if (searchTerm.length === 0) {
      this.loadUsers(1);
    }
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.loadUsers(1);
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