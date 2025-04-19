import { Inject, PLATFORM_ID, Component, OnInit } from '@angular/core';
import { User, Metrics, UserService } from '../../services/user.service';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private userService: UserService
  ) {}

  title = 'SkillMatch AI';
  adminInitials = 'SA';
  currentNavItem = 'User Management';
  activeTab = 'All Users';
  currentPage = 1;
  totalPages = 1;  
  isLoading = false;
  error: string | null = null;

  metrics: Metrics = {
    totalUsers: { count: 0, growth: 0 },
    jobSeekers: { count: 0, growth: 0 },
    recruiters: { count: 0, growth: 0 }
  };

  navItems = [
    { name: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { name: 'User Management', icon: 'people', route: '/users' },
    { name: 'Security', icon: 'shield', route: '/security' },
    { name: 'AI Accuracy', icon: 'analytics', route: '/ai-accuracy' },
    { name: 'System Performance', icon: 'speed', route: '/systemPerformance' }
  ];

  tabs = ['All Users', 'Job Seekers', 'Recruiters', 'Admins'];
  users: User[] = [];

  showAddUserModal = false;
  newUser = {
    full_name: '',
    email: '',
    password: '',
    user_type: 'job_seeker'
  };

  showEditUserModal = false;
  currentEditUser: {
    id: string;
    full_name: string;
    email: string;
    user_type: string;
  } = {
    id: '',
    full_name: '',
    email: '',
    user_type: ''
  };

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
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
        return undefined;
    }
  }

  async loadMetrics() {
    try {
      this.isLoading = true;
      this.error = null;
      const metrics = await this.userService.getMetrics();
      this.metrics = metrics || this.metrics;  
    } catch (error: any) {
      console.error('Error loading metrics:', error);
      this.error = 'Failed to load metrics: ' + (error.message || 'Unknown error');
    } finally {
      this.isLoading = false;
    }
  }

  async loadUsers(page: number = 1) {
    try {
      this.isLoading = true;
      this.error = null;
      const role = this.getRoleForTab(this.activeTab);
      const response = await this.userService.getUsers(page, 10, role);
      this.users = response.users || [];
      this.totalPages = response.totalPages || 1;
      this.currentPage = page;
    } catch (error: any) {
      console.error('Error loading users:', error);
      this.error = 'Failed to load users: ' + (error.message || 'Unknown error');
    } finally {
      this.isLoading = false;
    }
  }

  navigateTo(item: any) {
    this.currentNavItem = item.name;
    this.router.navigate([item.route]);
  }

  addUser() {
    this.showAddUserModal = true;
    console.log('Add user clicked');
  }

  cancelAddUser() {
    this.showAddUserModal = false;
    this.newUser = {
      full_name: '',
      email: '',
      password: '',
      user_type: 'job_seeker'
    };
  }

  async submitNewUser() {
    try {
      this.isLoading = true;
      this.error = null;
      await this.userService.createUser(this.newUser);
      this.cancelAddUser();
      await Promise.all([this.loadUsers(this.currentPage), this.loadMetrics()]);  
      console.log('User created successfully');
    } catch (error: any) {
      console.error('Error creating user:', error);
      this.error = 'Failed to create user: ' + (error.message || 'Unknown error');
    } finally {
      this.isLoading = false;
    }
  }

  editUser(userId: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      this.currentEditUser = {
        id: user.id,
        full_name: user.name,
        email: user.email,
        user_type: user.role
      };
      this.showEditUserModal = true;
    }
  }

  cancelEditUser() {
    this.showEditUserModal = false;
    this.currentEditUser = { id: '', full_name: '', email: '', user_type: '' };
  }

  async updateUser() {
    try {
      this.isLoading = true;
      this.error = null;
      await this.userService.updateUser(this.currentEditUser.id, {
        full_name: this.currentEditUser.full_name,
        email: this.currentEditUser.email,
        user_type: this.currentEditUser.user_type
      });
      this.cancelEditUser();
      await Promise.all([this.loadUsers(this.currentPage), this.loadMetrics()]);
      console.log('User updated successfully');
    } catch (error: any) {
      console.error('Error updating user:', error);
      this.error = 'Failed to update user: ' + (error.message || 'Unknown error');
    } finally {
      this.isLoading = false;
    }
  }

  async deleteUser() {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        this.isLoading = true;
        this.error = null;
        await this.userService.deleteUser(this.currentEditUser.id);
        this.cancelEditUser();
        await Promise.all([this.loadUsers(this.currentPage), this.loadMetrics()]);
        console.log('User deleted successfully');
      } catch (error: any) {
        console.error('Error deleting user:', error);
        this.error = 'Failed to delete user: ' + (error.message || 'Unknown error');
      } finally {
        this.isLoading = false;
      }
    }
  }

  async searchUsers(event: any) {
    const searchTerm = event.target.value;
    try {
      this.isLoading = true;
      this.error = null;
      if (searchTerm.length >= 3) {
        const role = this.getRoleForTab(this.activeTab);
        const response = await this.userService.searchUsers(searchTerm, role);
        this.users = response.users || [];
        this.totalPages = response.totalPages || 1;
        this.currentPage = 1;
      } else if (searchTerm.length === 0) {
        await this.loadUsers(1);
      }
    } catch (error: any) {
      console.error('Error searching users:', error);
      this.error = 'Failed to search users: ' + (error.message || 'Unknown error');
    } finally {
      this.isLoading = false;
    }
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.currentPage = 1;
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