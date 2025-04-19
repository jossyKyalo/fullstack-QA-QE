import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { 
  JobSeekerDbService, 
  User, 
  JobSeeker, 
  Job, 
  UserSkill, 
  Application,
  ResumeAnalysis,
  EmploymentPreference
} from '../../services/job-seeker-db.service';

import { 
  AiDatabaseService,
  SkillGapAnalysis
} from '../../services/ai-database.service';

@Component({
  selector: 'app-job-seeker-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './job-seeker-dashboard.component.html',
  styleUrls: ['./job-seeker-dashboard.component.css'],
  providers: [JobSeekerDbService, AiDatabaseService]
})
export class JobSeekerDashboardComponent implements OnInit {
  // User and profile data
  currentUser: User | null = null;
  userProfile: JobSeeker | null = null;
  userName: string = 'Job Seeker';
  
  // Dashboard data
  jobRecommendations: Job[] = [];
  userSkills: UserSkill[] = [];
  applications: Application[] = [];
  resumeAnalysis: ResumeAnalysis | null = null;
  employmentPreferences: EmploymentPreference[] = [];
  
  // UI states
  isLoading: boolean = true;
  hasError: boolean = false;
  selectedJob: Job | null = null;
  isApplying: boolean = false;
  fileUploading: boolean = false;
  skillGapAnalysis: SkillGapAnalysis | null = null;
  showSkillGapModal: boolean = false;
  
  constructor(
    private jobSeekerService: JobSeekerDbService,
    private aiService: AiDatabaseService
  ) {}
  
  ngOnInit(): void {
    this.loadDashboardData();
  }
  
  loadDashboardData(): void {
    this.isLoading = true;
    this.hasError = false;
    
    // Get current user
    this.jobSeekerService.getCurrentUser().subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.userName = user.full_name;
        
        // Get all dashboard data for this user
        this.jobSeekerService.getDashboardData(user.user_id).subscribe({
          next: (data) => {
            this.userProfile = data.profile;
            this.userSkills = data.skills;
            this.jobRecommendations = data.matches;
            this.applications = data.applications;
            this.resumeAnalysis = data.resume;
            this.employmentPreferences = data.preferences;
            
            // Mark jobs that user has already applied to
            this.markAppliedJobs();
            
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Failed to load dashboard data:', error);
            this.hasError = true;
            this.isLoading = false;
          }
        });
      } else {
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }
  
  // Mark jobs that the user has already applied to
  markAppliedJobs(): void {
    if (this.applications.length > 0 && this.jobRecommendations.length > 0) {
      const appliedJobIds = this.applications.map(app => app.job_id);
      
      this.jobRecommendations = this.jobRecommendations.map(job => ({
        ...job,
        applied: appliedJobIds.includes(job.job_id)
      }));
    }
  }
  
  // Apply for a job
  applyForJob(job: Job): void {
    if (!this.userProfile) return;
    
    this.isApplying = true;
    this.selectedJob = job;
    
    this.jobSeekerService.applyForJob(job.job_id, this.userProfile.jobseeker_id)
      .subscribe({
        next: (response) => {
          this.isApplying = false;
          
          if (response.success) {
            // Update UI to show job has been applied for
            const index = this.jobRecommendations.findIndex(j => j.job_id === job.job_id);
            if (index !== -1) {
              this.jobRecommendations[index] = {
                ...job,
                applied: true
              };
            }
            
            // Add to applications list
            this.applications.push({
              application_id: 0, 
              job_id: job.job_id,
              jobseeker_id: this.userProfile!.jobseeker_id,
              status: 'applied',
              applied_date: new Date().toISOString(),
              match_score: job.match_score || 0,
              notes: ''
            });
            
            alert(`Successfully applied to ${job.title} at ${job.company_name}`);
          } else {
            alert(response.message || 'Failed to apply. Please try again.');
          }
        },
        error: () => {
          this.isApplying = false;
          alert('An error occurred. Please try again later.');
        }
      });
  }
  
  // Take a new skills assessment
  takeNewAssessment(): void {
    if (!this.currentUser) return;
    
    this.jobSeekerService.scheduleAssessment(this.currentUser.user_id, 'technical_skills')
      .subscribe(response => {
        if (response.assessmentUrl) {
          window.open(response.assessmentUrl, '_blank');
        }
      });
  }
  
  // Upload a new resume
  uploadNewResume(event: Event): void {
    if (!this.userProfile) return;
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    
    const file = input.files[0];
    this.fileUploading = true;
    
    this.jobSeekerService.uploadResume(this.userProfile.jobseeker_id, file)
      .subscribe({
        next: (analysis) => {
          this.fileUploading = false;
          this.resumeAnalysis = analysis;
          
          // Now use aiService to get additional skill suggestions
          this.analyzeSkillGaps();
        },
        error: (error) => {
          this.fileUploading = false;
          console.error('Failed to upload resume:', error);
          alert('Failed to upload resume. Please try again.');
        }
      });
  }

  // Use the aiService to analyze skill gaps
  analyzeSkillGaps(): void {
    if (!this.userProfile || !this.selectedJob) return;
    
    this.aiService.analyzeSkillGap(this.userSkills, this.selectedJob.job_id)
      .subscribe({
        next: (analysis) => {
          this.skillGapAnalysis = analysis;
          this.showSkillGapModal = true;
        },
        error: (error) => {
          console.error('Failed to analyze skill gaps:', error);
        }
      });
  }

  // Add method to suggest additional skills
  suggestAdditionalSkills(): void {
    if (!this.currentUser) return;
    
    this.aiService.suggestAdditionalSkills(this.currentUser.user_id)
      .subscribe({
        next: (suggestedSkills) => {
          // Do something with suggested skills
          console.log('Suggested skills:', suggestedSkills);
          // Maybe show them in UI or add to user's profile
        },
        error: (error) => {
          console.error('Failed to get skill suggestions:', error);
        }
      });
  }
}