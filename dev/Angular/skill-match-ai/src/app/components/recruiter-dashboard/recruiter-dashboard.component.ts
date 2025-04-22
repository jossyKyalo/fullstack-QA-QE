import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecruiterService } from '../../services/recruiter.service';
import { AiAssistantService } from '../../services/ai-assistant.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recruiter-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recruiter-dashboard.component.html',
  styleUrls: ['./recruiter-dashboard.component.css']
})
export class RecruiterDashboardComponent implements OnInit {
  recruiterName = 'Kyalo';
  searchQuery = '';
  
  metrics: any[] = [];
  activeJobs: any[] = [];
  candidateMatches: any[] = [];
  
  showAiAssistantModal = false;
  aiAssistantMode: 'jobSuggestion' | 'candidateSuggestion' | 'jobDescription' = 'candidateSuggestion';
  aiAssistantLoading = false;
  aiAssistantResults: any[] = [];
  selectedJob: any = null;
  
  showJobModal = false;
  newJob = {
    title: '',
    description: '',
    location: '',
    remoteOption: false,
    employmentType: 'full-time',
    department: '',
    requiredSkills: [] as string[]
  };
  availableSkills: any[] = [];
  skillSearch = '';
  
  constructor(
    private recruiterService: RecruiterService, 
    private aiAssistantService: AiAssistantService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const recruiterId = 1; // Replace with dynamic ID from auth service

    this.recruiterService.getMetrics(recruiterId).subscribe((data) => {
      this.metrics = data;
    });

    this.recruiterService.getActiveJobs(recruiterId).subscribe((jobs) => {
      this.activeJobs = jobs;
    });

    this.recruiterService.getCandidateMatches(recruiterId).subscribe((candidates) => {
      this.candidateMatches = candidates;
    });
    
    // Load available skills for job creation
    this.fetchAvailableSkills();
  }

  // AI Assistant functionality
  activateAIAssistant(): void {
    this.showAiAssistantModal = true;
    this.aiAssistantMode = 'candidateSuggestion';
    
    if (this.activeJobs.length > 0) {
      this.selectedJob = this.activeJobs[0];
      this.loadAICandidateSuggestions();
    }
  }
  
  closeAiAssistant(): void {
    this.showAiAssistantModal = false;
  }
  
  changeAiMode(mode: 'jobSuggestion' | 'candidateSuggestion' | 'jobDescription'): void {
    this.aiAssistantMode = mode;
    this.aiAssistantResults = [];
    
    if (mode === 'candidateSuggestion' && this.selectedJob) {
      this.loadAICandidateSuggestions();
    } else if (mode === 'jobDescription') {
      // Reset new job form
      this.newJob = {
        title: '',
        description: '',
        location: '',
        remoteOption: false,
        employmentType: 'full-time',
        department: '',
        requiredSkills: []
      };
    }
  }
  
  selectJob(job: any): void {
    this.selectedJob = job;
    if (this.aiAssistantMode === 'candidateSuggestion') {
      this.loadAICandidateSuggestions();
    }
  }
  
  loadAICandidateSuggestions(): void {
    if (!this.selectedJob) return;
    
    this.aiAssistantLoading = true;
    this.aiAssistantService.getSuggestedCandidates(this.selectedJob.id).subscribe({
      next: (data) => {
        this.aiAssistantResults = data;
        this.aiAssistantLoading = false;
      },
      error: (err) => {
        console.error('Error loading AI suggestions:', err);
        this.aiAssistantLoading = false;
        // Show mock data for demonstration
        this.aiAssistantResults = [
          { 
            id: 101, 
            name: 'Jane Cooper', 
            matchScore: 92,
            position: 'Senior Developer',
            location: 'Remote',
            skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
            reasonForMatch: 'Strong match on technical skills and experience level'
          },
          { 
            id: 102, 
            name: 'Alex Morgan', 
            matchScore: 87,
            position: 'Full Stack Developer',
            location: 'New York',
            skills: ['Angular', 'TypeScript', 'MongoDB', 'Express'],
            reasonForMatch: 'Good match on technical skills with relevant industry experience'
          },
          { 
            id: 103, 
            name: 'Sam Wilson', 
            matchScore: 83,
            position: 'Frontend Developer',
            location: 'San Francisco',
            skills: ['React', 'JavaScript', 'CSS', 'HTML'],
            reasonForMatch: 'Strong frontend skills matching job requirements'
          }
        ];
      }
    });
  }
  
  generateJobDescription(): void {
    if (!this.newJob.title || !this.newJob.requiredSkills.length) {
      alert('Please enter at least a job title and some required skills');
      return;
    }
    
    this.aiAssistantLoading = true;
    this.aiAssistantService.generateJobDescription({
      title: this.newJob.title,
      skills: this.newJob.requiredSkills,
      employmentType: this.newJob.employmentType,
      location: this.newJob.location,
      remoteOption: this.newJob.remoteOption
    }).subscribe({
      next: (data) => {
        this.newJob.description = data.description;
        this.aiAssistantLoading = false;
      },
      error: (err) => {
        console.error('Error generating job description:', err);
        this.aiAssistantLoading = false;
        // Mock data for demonstration
        this.newJob.description = `We are seeking an experienced ${this.newJob.title} to join our team. The ideal candidate will have strong skills in ${this.newJob.requiredSkills.join(', ')}. ${this.newJob.remoteOption ? 'This position offers remote work flexibility.' : 'This position is located in ' + this.newJob.location}.

Responsibilities:
- Design and develop high-quality applications using best practices
- Collaborate with cross-functional teams to define, design, and ship new features
- Identify and address performance bottlenecks
- Write clean, maintainable code with proper documentation

Requirements:
- Proficiency in ${this.newJob.requiredSkills.join(', ')}
- Strong problem-solving skills and attention to detail
- Excellent communication and teamwork abilities
- Experience working in an Agile environment

We offer competitive compensation, benefits, and a collaborative work environment focused on innovation and professional growth.`;
      }
    });
  }
  
  // Job posting functionality
  postNewJob(): void {
    this.showJobModal = true;
    this.fetchAvailableSkills();
  }
  
  closeJobModal(): void {
    this.showJobModal = false;
  }
  
  fetchAvailableSkills(): void {
    // In a real application, you would fetch this from an API
    // Using mock data for demonstration
    this.availableSkills = [
      { id: 1, name: 'JavaScript', category: 'technical' },
      { id: 2, name: 'React', category: 'technical' },
      { id: 3, name: 'Angular', category: 'technical' },
      { id: 4, name: 'TypeScript', category: 'technical' },
      { id: 5, name: 'Node.js', category: 'technical' },
      { id: 6, name: 'PostgreSQL', category: 'technical' },
      { id: 7, name: 'MongoDB', category: 'technical' },
      { id: 8, name: 'Communication', category: 'soft' },
      { id: 9, name: 'Leadership', category: 'soft' },
      { id: 10, name: 'Problem Solving', category: 'soft' },
      { id: 11, name: 'Teamwork', category: 'soft' },
      { id: 12, name: 'Python', category: 'technical' },
      { id: 13, name: 'Java', category: 'technical' },
      { id: 14, name: 'Git', category: 'technical' }
    ];
  }
  
  filteredSkills(): any[] {
    if (!this.skillSearch.trim()) return this.availableSkills;
    return this.availableSkills.filter(skill => 
      skill.name.toLowerCase().includes(this.skillSearch.toLowerCase())
    );
  }
  
  addSkill(skill: any): void {
    if (!this.newJob.requiredSkills.includes(skill.name)) {
      this.newJob.requiredSkills.push(skill.name);
    }
    this.skillSearch = '';
  }
  
  removeSkill(skillToRemove: string): void {
    this.newJob.requiredSkills = this.newJob.requiredSkills.filter(skill => skill !== skillToRemove);
  }
  
  submitNewJob(): void {
    if (!this.newJob.title || !this.newJob.description) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Format job data according to your database schema
    const jobData = {
      title: this.newJob.title,
      description: this.newJob.description,
      location: this.newJob.location,
      remoteOption: this.newJob.remoteOption,
      employmentType: this.newJob.employmentType,
      department: this.newJob.department,
      requiredSkills: this.newJob.requiredSkills.map(skillName => {
        const skill = this.availableSkills.find(s => s.name === skillName);
        return { skillId: skill ? skill.id : null, skillName, importanceLevel: 3 };
      })
    };
    
    this.recruiterService.createJob(jobData).subscribe({
      next: (response) => {
        alert('Job posted successfully!');
        this.showJobModal = false;
        
        // Refresh active jobs list
        const recruiterId = 1; // Replace with dynamic ID
        this.recruiterService.getActiveJobs(recruiterId).subscribe((jobs) => {
          this.activeJobs = jobs;
        });
      },
      error: (err) => {
        console.error('Error posting job:', err);
        alert('Failed to post job. Please try again.');
      }
    });
  }
  
  // Search functionality
  search(): void {
    if (!this.searchQuery.trim()) return;
    
    this.recruiterService.searchCandidates(this.searchQuery).subscribe({
      next: (candidates) => {
        this.candidateMatches = candidates;
      },
      error: (err) => {
        console.error('Search error:', err);
      }
    });
  }
  
  contactCandidate(candidate: any): void {
    const message = {
      candidateId: candidate.id || candidate.name,
      content: `Hello ${candidate.name}, we're interested in your profile.`
    };
    
    this.recruiterService.contactCandidate(message).subscribe({
      next: () => {
        alert(`Message sent to ${candidate.name}`);
      },
      error: (err) => {
        console.error('Error contacting candidate:', err);
        alert('Failed to send message. Please try again.');
      }
    });
  }
}