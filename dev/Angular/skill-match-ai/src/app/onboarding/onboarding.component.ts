import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OnboardingService } from '../services/onboarding.service';
import { CommonModule } from '@angular/common';

interface Skill {
  skill_id: number;
  skill_name: string;
  category: string;
  proficiency?: number;
}

@Component({
  selector: 'app-onboarding',
  imports:[CommonModule, FormsModule, ReactiveFormsModule],
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
      const mockSkills: Skill[] = [
        { skill_id: 1, skill_name: 'JavaScript', category: 'technical' },
        { skill_id: 2, skill_name: 'React', category: 'technical' },
        { skill_id: 3, skill_name: 'UI/UX Design', category: 'technical' },
        { skill_id: 4, skill_name: 'Project Management', category: 'soft' }
      ];
      this.skillSearchResults = mockSkills.filter(skill =>
        skill.skill_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !this.selectedSkills.some(s => s.skill_id === skill.skill_id)
      );
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
    console.log('Extracting skills from resume:', file.name);
    setTimeout(() => {
      const extractedSkills: Skill[] = [
        { skill_id: 5, skill_name: 'TypeScript', category: 'technical', proficiency: 80 },
        { skill_id: 6, skill_name: 'Angular', category: 'technical', proficiency: 75 },
        { skill_id: 7, skill_name: 'Team Leadership', category: 'soft', proficiency: 85 }
      ];
      extractedSkills.forEach(skill => {
        if (!this.selectedSkills.some(s => s.skill_id === skill.skill_id)) {
          this.selectedSkills.push(skill);
        }
      });
    }, 1000);
  }

  completeOnboarding(): void {
    const onboardingData = {
      profile: this.profileForm.value,
      skills: this.selectedSkills,
      resume: this.resumeFile,
      preferences: this.preferencesForm.value
    };
    console.log('Onboarding data:', onboardingData);
    this.onboardingService.saveOnboardingData(onboardingData).subscribe(
      () => {
        this.router.navigate(['/jobSeeker']);
      },
      error => {
        console.error('Error saving onboarding data:', error);
      }
    );
  }
}