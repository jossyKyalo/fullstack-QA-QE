import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OnboardingService } from '../services/onboarding.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

interface Skill {
  skill_id: number;
  skill_name: string;
  category: string;
  proficiency?: number;
}

@Component({
  selector: 'app-onboarding',
  imports:[CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  standalone: true,
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css']
})
export class OnboardingComponent implements OnInit {
  currentStep = 1;

  // Form groups for each step
  profileForm!: FormGroup;
  skillsForm!: FormGroup;
  resumeForm!: FormGroup;
  preferencesForm!: FormGroup;

  // Skill search
  skillSearchControl = new FormControl('');
  skillSearchResults: Skill[] = [];
  selectedSkills: Skill[] = [];

  // File uploads
  @ViewChild('photoUpload') photoUpload!: ElementRef;
  @ViewChild('resumeUpload') resumeUpload!: ElementRef;
  profilePhotoPreview: string | null = null;
  resumeFileName: string | null = null;
  resumeFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private onboardingService: OnboardingService
  ) {}

  ngOnInit(): void {
    this.initForms();
  }

  initForms(): void {
    this.profileForm = this.fb.group({
      headline: ['', Validators.required],
      currentCompany: [''],
      yearsExperience: [0, [Validators.min(0), Validators.max(50)]]
    });

    this.skillsForm = this.fb.group({});

    this.resumeForm = this.fb.group({
      extractSkills: [true]
    });

    this.preferencesForm = this.fb.group({
      location: [''],
      remotePreference: [false],
      fullTime: [true],
      partTime: [false],
      contract: [false],
      internship: [false]
    });
  }

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

  triggerPhotoUpload(): void {
    this.photoUpload?.nativeElement.click();
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePhotoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerResumeUpload(): void {
    this.resumeUpload.nativeElement.click();
  }

  onResumeSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.resumeFile = file;
      this.resumeFileName = file.name;
      if (this.resumeForm?.get('extractSkills')?.value) {
        this.extractSkillsFromResume(file);
      }
    }
  }

  removeResume(event: Event): void {
    event.stopPropagation();
    this.resumeFile = null;
    this.resumeFileName = null;
    this.resumeUpload.nativeElement.value = '';
  }

   
  searchSkills(): void {
    const searchTerm = this.skillSearchControl.value;
    if (searchTerm && searchTerm.length >= 2) {
      this.onboardingService.getSkillSuggestions(searchTerm).subscribe(skills => {
        this.skillSearchResults = skills.filter(skill => 
          !this.selectedSkills.some(s => s.skill_id === skill.skill_id)
        );
      });
    } else {
      this.skillSearchResults = [];
    }
  }
  
  addSkill(skill: Skill): void {
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

  extractSkillsFromResume(file: File): void {
    this.onboardingService.extractSkillsFromResume(file).subscribe(
      extractedSkills => {
        extractedSkills.forEach(skill => {
          if (!this.selectedSkills.some(s => s.skill_id === skill.skill_id)) {
            this.selectedSkills.push(skill);
          }
        });
      },
      error => {
        console.error('Error extracting skills:', error);
      }
    );
  }

  completeOnboarding(): void {
    // Get the profile photo if it exists
    let profilePhoto = null;
    if (this.profilePhotoPreview && this.photoUpload?.nativeElement) {
      // Extract the file from the element
      profilePhoto = this.photoUpload.nativeElement.files[0];
    }
  
    const onboardingData = {
      profile: this.profileForm.value,
      skills: this.selectedSkills,
      resume: this.resumeFile,
      profilePhoto: profilePhoto,
      preferences: this.preferencesForm.value
    };
    
    console.log('Onboarding data:', onboardingData);
    this.onboardingService.saveOnboardingData(onboardingData).subscribe(
      (response) => {
        console.log('Onboarding complete:', response);
        this.router.navigate(['/jobSeeker']);
      },
      error => {
        console.error('Error saving onboarding data:', error);
      }
    );
  }
  
}