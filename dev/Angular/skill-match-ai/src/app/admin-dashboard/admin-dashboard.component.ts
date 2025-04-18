import {Inject, PLATFORM_ID, Component, OnInit } from '@angular/core';
import {User, Metrics, UserService } from '../services/user.service';
import {isPlatformBrowser, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
 

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object,private router: Router, private userService: UserService) {}
  title = 'SkillMatch AI';
  adminInitials = 'SA';
  currentNavItem = 'User Management';
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
    { name: 'Dashboard', icon: 'dashboard', route: '/dashboard'},
    { name: 'User Management', icon: 'people', route:'/users' },
    { name: 'Security', icon: 'shield', route:'/security' },
    { name: 'AI Accuracy', icon: 'analytics', route: '/ai-accuracy' },
    { name: 'System Performance', icon: 'speed', route: 'systemPerformance' }
  ];

  tabs = ['All Users', 'Job Seekers', 'Recruiters', 'Admins'];
  users: User[] = [];


  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // safe to use document or window here
      const el = document.getElementById('dashboard');
      console.log('Cookies present:', document.cookie ? 'Yes' : 'No');
      console.log('Cookie content:', document.cookie);
    }
    
    this.loadMetrics();
    this.loadUsers();
  }
  getRoleForTab(tab: string): string | undefined {
    switch (tab) {
      case 'Job Seekers':
        return 'job_seeker';
      case 'Recruiters':
        return 'recruiter';
      case 'Admins':
        return 'admin';
      default:
        return undefined; // for 'All Users'
    }
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
      const role = this.getRoleForTab(this.activeTab);
      const response = await this.userService.getUsers(page, 10, role);
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
    this.router.navigate([item.route]);
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
        const role = this.getRoleForTab(this.activeTab);
        const response = await this.userService.searchUsers(searchTerm, role);
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