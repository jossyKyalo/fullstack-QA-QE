// job-seeker-dashboard.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-job-seeker-dashboard',
  imports:[CommonModule],
  templateUrl: './job-seeker-dashboard.component.html',
  styleUrls: ['./job-seeker-dashboard.component.css']
})
export class JobSeekerDashboardComponent {
  userName: string = 'Job Doe';
  
  jobRecommendations = [
    { 
      title: 'Senior Frontend developer', 
      company: 'Rafted Technologies', 
      location: 'Nairobi'
    },
    { 
      title: 'UI/UX Designer', 
      company: 'DesignHub', 
      location: 'Remote'
    },
    { 
      title: 'Product Manager', 
      company: 'Microsoft', 
      location: 'Kenya'
    }
  ];
  
  skills = [
    { name: 'JavaScript', percentage: 90 },
    { name: 'React', percentage: 70 },
    { name: 'UI/UX', percentage: 100 }
  ];
  
  resumeAnalysis = {
    fileName: 'Resume_John_Doe.pdf',
    keywordOptimization: 87,
    industryAlignment: 'High'
  };
  
  takeNewAssessment() {
    console.log('Taking new assessment');
    // Logic for starting a new assessment  
  }
  
  applyForJob(jobTitle: string) {
    console.log(`Applying for ${jobTitle}`);
    // Logic for applying to a job  
  }
}
