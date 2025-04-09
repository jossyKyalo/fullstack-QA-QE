// security-management.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface Role {
  id: number;
  name: string;
  tags: string[];
  permissions: number;
}

@Component({
  selector: 'app-security-management',
  imports: [ CommonModule],
  templateUrl: './security-management.component.html',
  styleUrls: ['./security-management.component.css']
})
export class SecurityManagementComponent implements OnInit {
  activeTab: string = 'roles';
  roles: Role[] = [
    { id: 1, name: 'Super Admin', tags: ['all'], permissions: 1 },
    { id: 2, name: 'Security Admin', tags: ['security', 'monitoring'], permissions: 2 },
    { id: 3, name: 'User Admin', tags: ['user_management'], permissions: 1 },
    { id: 4, name: 'AI Admin', tags: ['ai_accuracy'], permissions: 3 }
  ];

  constructor() { }

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
