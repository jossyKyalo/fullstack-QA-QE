import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Metric {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
}

interface JobPosting {
  title: string;
  department: string;
  location: string;
  applicants: number;
}

interface Candidate {
  name: string;
  position: string;
  location: string;
}

@Component({
  selector: 'app-recruiter-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recruiter-dashboard.component.html',
  styleUrls: ['./recruiter-dashboard.component.css']
})
export class RecruiterDashboardComponent {
  recruiterName = 'Kyalo';
  searchQuery = '';

  metrics: Metric[] = [
    { 
      title: 'Application rate', 
      value: '12.8%', 
      trend: '+3.5%', 
      isPositive: true 
    },
    { 
      title: 'Candidate Quality', 
      value: '8.6/10', 
      trend: '+0.4%', 
      isPositive: true 
    },
    { 
      title: 'Avg. Time to Hire', 
      value: '18 days', 
      trend: '-10 days', 
      isPositive: true 
    }
  ];

  activeJobs: JobPosting[] = [
    { 
      title: 'Senior Frontend Developer', 
      department: 'Engineering', 
      location: 'Nairobi', 
      applicants: 24 
    },
    { 
      title: 'UI/UX Designer', 
      department: 'Design', 
      location: 'Remote', 
      applicants: 18 
    }
  ];

  candidateMatches: Candidate[] = [
    { 
      name: 'Blaise Kyalo', 
      position: 'Frontend Developer', 
      location: 'Nairobi' 
    },
    { 
      name: 'Marisa Cheloti', 
      position: 'UI/UX Designer', 
      location: 'Remote' 
    },
    { 
      name: 'Sabrina Mutethya', 
      position: 'Product Manager', 
      location: 'Nairobi' 
    }
  ];

  search(): void {
    console.log('Searching for:', this.searchQuery);
    //search functionality
  }

  activateAIAssistant(): void {
    console.log('AI Assistant activated');
    // AI assistant functionality
  }

  postNewJob(): void {
    console.log('Post new job clicked');
    //post new job functionality
  }

  contactCandidate(candidate: Candidate): void {
    console.log('Contact candidate:', candidate.name);
    //contact candidate functionality
  }
}