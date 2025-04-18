import { Inject, PLATFORM_ID, Component, OnInit } from '@angular/core';
import { User, Metrics, UserService } from '../services/user.service';
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
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router, private userService: UserService) { }
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
    { name: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { name: 'User Management', icon: 'people', route: '/users' },
    { name: 'Security', icon: 'shield', route: '/security' },
    { name: 'AI Accuracy', icon: 'analytics', route: '/ai-accuracy' },
    { name: 'System Performance', icon: 'speed', route: 'systemPerformance' }
  ];

  tabs = ['All Users', 'Job Seekers', 'Recruiters', 'Admins'];
  users: User[] = [];

  showAddUserModal = false;
  newUser = {
    full_name: '',
    email: '',
    password: '',
    user_type: 'job_seeker' // Default value
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
    this.showAddUserModal = true;
    console.log('Add user clicked');
  }
  cancelAddUser() {
    this.showAddUserModal = false;
    // Reset form
    this.newUser = {
      full_name: '',
      email: '',
      password: '',
      user_type: 'job_seeker'
    };
  }
  
  async submitNewUser() {
    try {
      await this.userService.createUser(this.newUser);
      
      // Close modal and reload users
      this.showAddUserModal = false;
      this.loadUsers(this.currentPage);
      
      //success message
      console.log('User created successfully');
    } catch (error) {
      console.error('Error creating user:', error);
      // Display error message to user
    }
  }

  async editUser(userId: string) {
    try {
      // Find the user in the current list (for immediate display)
      const user = this.users.find(u => u.id === userId);
      
      if (user) {
        // Set up the edit form with current values
        this.currentEditUser = {
          id: user.id,
          full_name: user.name, // Mapping from name to full_name
          email: user.email,
          user_type: user.role // Mapping from role to user_type
        };
        
        // Show the modal
        this.showEditUserModal = true;
      }
    } catch (error) {
      console.error('Error setting up user edit:', error);
    }
  }
  cancelEditUser() {
    this.showEditUserModal = false;
  }
  async updateUser() {
    try {
      await this.userService.updateUser(
        this.currentEditUser.id, 
        {
          full_name: this.currentEditUser.full_name,
          email: this.currentEditUser.email,
          user_type: this.currentEditUser.user_type
        }
      );
      
      // Close modal and reload users
      this.showEditUserModal = false;
      this.loadUsers(this.currentPage);
      
      // Success message
      console.log('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      // Display error message
    }
  }
  async deleteUser() {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await this.userService.deleteUser(this.currentEditUser.id);
        
        // Close modal and reload users
        this.showEditUserModal = false;
        this.loadUsers(this.currentPage);
        
        // Success message
        console.log('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        // Display error message
      }
    }
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