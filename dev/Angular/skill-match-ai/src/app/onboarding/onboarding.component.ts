// onboarding.component.ts
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OnboardingService } from '../services/onboarding.service';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {
  currentStep = 1;
  
  // Form groups for each step
  profileForm?: FormGroup;
  skillsForm?: FormGroup;
  resumeForm?: FormGroup;
  preferencesForm?: FormGroup;
  
  // Skill search
  skillSearchControl = new FormControl('');
  skillSearchResults = [];
  selectedSkills = [];
  
  // File uploads
  @ViewChild('photoUpload') photoUpload?: ElementRef;
  @ViewChild('resumeUpload') resumeUpload?: ElementRef;
  profilePhotoPreview: string | null = null;
  resumeFileName: string | null = null;
  resumeFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private onboardingService: OnboardingService
  ) { }

  ngOnInit(): void {
    this.initForms();
  }

  initForms(): void {
    // Step 1: Professional Profile
    this.profileForm = this.fb.group({
      headline: ['', Validators.required],
      currentCompany: [''],
      yearsExperience: [0, [Validators.min(0), Validators.max(50)]]
    });

    // Step 2: Skills
    this.skillsForm = this.fb.group({});

    // Step 3: Resume
    this.resumeForm = this.fb.group({
      extractSkills: [true]
    });

    // Step 4: Preferences
    this.preferencesForm = this.fb.group({
      location: [''],
      remotePreference: [false],
      fullTime: [true],
      partTime: [false],
      contract: [false],
      internship: [false]
    });
  }

  // Navigation methods
  nextStep(): void {
    if (this.currentStep < 4) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  skipStep(): void {
    this.nextStep();
  }

  // Photo upload methods
  triggerPhotoUpload(): void {
    this.photoUpload?.nativeElement.click();
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePhotoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
      
      // Would normally upload to server here
    }
  }

  // Resume upload methods
  triggerResumeUpload(): void {
    this.resumeUpload?.nativeElement.click();
  }

  onResumeSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.resumeFile = file;
      this.resumeFileName = file.name;
      
      // If extract skills is checked, would call an API to extract skills
      if (this.resumeForm?.get('extractSkills')?.value) {
        // Simulating skill extraction
        this.extractSkillsFromResume(file);
      }
    }
  }

  removeResume(event: Event): void {
    event.stopPropagation();
    this.resumeFile = null;
    this.resumeFileName = null;
    this.resumeUpload?.nativeElement.value? = '';
  }

  // Skills methods
  searchSkills(): void {
    const searchTerm = this.skillSearchControl.value;
    if (searchTerm && searchTerm.length >= 2) {
      // Would call API here
      // For now, using mock data
      this.skillSearchResults? = [
        { skill_id: 1, skill_name: 'JavaScript', category: 'technical' },
        { skill_id: 2, skill_name: 'React', category: 'technical' },
        { skill_id: 3, skill_name: 'UI/UX Design', category: 'technical' },
        { skill_id: 4, skill_name: 'Project Management', category: 'soft' }
      ].filter(skill => 
        skill.skill_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !this.selectedSkills.some(s => s.skill_id === skill.skill_id)
      );
    } else {
      this.skillSearchResults = [];
    }
  }

  addSkill(skill: any): void {
    // Add skill with default proficiency of 50%
    this.selectedSkills.push({
      ...skill,
      proficiency: 50
    });
    this.skillSearchResults = [];
    this.skillSearchControl.setValue('');
  }

  removeSkill(index: number): void {
    this.selectedSkills.splice(index, 1);
  }

  // Resume skill extraction (mock)
  extractSkillsFromResume(file: File): void {
    // Simulating API call to extract skills
    console.log('Extracting skills from resume:', file.name);
    
    // For demo, add some mock extracted skills
    setTimeout(() => {
      const extractedSkills = [
        { skill_id: 5, skill_name: 'TypeScript', category: 'technical', proficiency: 80 },
        { skill_id: 6, skill_name: 'Angular', category: 'technical', proficiency: 75 },
        { skill_id: 7, skill_name: 'Team Leadership', category: 'soft', proficiency: 85 }
      ];
      
      // Add extracted skills that aren't already selected
      extractedSkills.forEach(skill => {
        if (!this.selectedSkills.some(s => s.skill_id === skill.skill_id)) {
          this.selectedSkills.push(skill);
        }
      });
    }, 1000);
  }

  // Final submission
  completeOnboarding(): void {
    // Collect all data from forms
    const onboardingData = {
      profile: this.profileForm.value,
      skills: this.selectedSkills,
      resume: this.resumeFile,
      preferences: this.preferencesForm.value
    };
    
    // Would send to API here
    console.log('Onboarding data:', onboardingData);
    
    // Navigate to dashboard
    this.onboardingService.saveOnboardingData(onboardingData).subscribe(
      () => {
        this.router.navigate(['/dashboard']);
      },
      error => {
        console.error('Error saving onboarding data:', error);
        // Would show error message here
      }
    );
  }
}