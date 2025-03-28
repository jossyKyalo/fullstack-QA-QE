import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

 
interface JobApplication {
  firstName: string;
  lastName: string;
  skills: string[];
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'formsAssignment';
  jobApplicationForm: FormGroup;

  submissionStatus: 'idle' | 'submitting' | 'success' | 'error' = 'idle';
  submissionMessage: string = '';

  constructor(private fb: FormBuilder) {
    this.jobApplicationForm = this.fb.group({
      firstName: ['', {
        validators: [Validators.required],
        asyncValidators: [this.nameExistsValidator()],
        updateOn: 'blur'
      }],
      lastName: ['', {
        validators: [Validators.required],
        asyncValidators: [this.nameExistsValidator()],
        updateOn: 'blur'
      }],
      skills: this.fb.array([])
    });
  }

  ngOnInit() {}

  get skillsControls() {
    return (this.jobApplicationForm.get('skills') as FormArray).controls;
  }

  get firstName() {
    return this.jobApplicationForm.get('firstName') ?? this.fb.control('');
  }

  get lastName() {
    return this.jobApplicationForm.get('lastName') ?? this.fb.control('');
  }

  addSkill() {
    const skillsArray = this.jobApplicationForm.get('skills') as FormArray;
    skillsArray.push(this.fb.control('', Validators.required));
  }

  removeSkill(index: number) {
    const skillsArray = this.jobApplicationForm.get('skills') as FormArray;
    skillsArray.removeAt(index);
  }

  nameExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this.checkNameExists(control.value).pipe(
        map(exists => exists ? { nameExists: true } : null)
      );
    };
  }

  checkNameExists(name: string): Observable<boolean> {
    const existingNames = ['John', 'Jane', 'Doe', 'Smith'];
    return of(existingNames.includes(name)).pipe(delay(1000));
  }

  onSubmit() {
    this.jobApplicationForm.markAllAsTouched();

    if (this.jobApplicationForm.valid) {
      this.submissionStatus = 'submitting';
      this.submissionMessage = '';

      const formData: JobApplication = {
        firstName: this.jobApplicationForm.get('firstName')?.value,
        lastName: this.jobApplicationForm.get('lastName')?.value,
        skills: this.skillsControls.map(control => control.value).filter(skill => skill.trim() !== '')
      };

      // ✅ Call the method (now inside the class)
      this.submitApplication(formData);
    } else {
      this.submissionStatus = 'error';
      this.submissionMessage = 'Please correct the errors in the form.';
    }
  }

  // ✅ Move this inside the class
  private submitApplication(applicationData: JobApplication) {
    this.simulateApiCall(applicationData).subscribe({
      next: (response) => {
        this.submissionStatus = 'success';
        this.submissionMessage = 'Application submitted successfully!';
        
        this.jobApplicationForm.reset();
        while ((this.jobApplicationForm.get('skills') as FormArray).length !== 0) {
          (this.jobApplicationForm.get('skills') as FormArray).removeAt(0);
        }
      },
      error: (error) => {
        this.submissionStatus = 'error';
        this.submissionMessage = 'Failed to submit application. Please try again.';
        console.error('Submission error:', error);
      }
    });
  }

  private simulateApiCall(data: JobApplication): Observable<any> {
    return of({
      status: 'success',
      message: 'Application received',
      data: data
    }).pipe(delay(2000));
  }
}
