// recruiter-dashboard.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-recruiter-dashboard',
  imports: [CommonModule],
  templateUrl: './recruiter-dashboard.component.html',
  styleUrls: ['./recruiter-dashboard.component.css']
})
export class RecruiterDashboardComponent {
  recruiterName: string = 'Kyalo';
  
  metrics = {
    applicationRate: {
      value: '15.8%',
      change: '+3.5%',
      trend: 'positive'
    },
    candidateQuality: {
      value: '8.6/10',
      change: '+0.4%',
      trend: 'positive'
    },
    avgTimeToHire: {
      value: '18 days',
      change: '-10 days',
      trend: 'positive' 
    }
  };
  
  activeJobPostings = [
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
      applicants: 16
    }
  ];
  
  candidateMatches = [
    {
      name: 'Blaise Kyalo',
      position: 'Frontend Developer',
      location: 'Nairobi'
    },
    {
      name: 'Marya Chabet',
      position: 'UI/UX Designer',
      location: 'Remote'
    },
    {
      name: 'Sabrina Munakyhe',
      position: 'Product Manager',
      location: 'Nairobi'
    }
  ];
  
  searchCandidates(event: any) {
    console.log('Searching for:', event.target.value);
    // Search implementation  
  }
  
  startAIAssistant() {
    console.log('Starting AI assistant');
    // AI assistant logic  
  }
  
  postNewJob() {
    console.log('Posting new job');
    // Job posting logic  
  }
  
  contactCandidate(candidate: any) {
    console.log('Contacting candidate:', candidate.name);
    // Contact logic  
  }
}