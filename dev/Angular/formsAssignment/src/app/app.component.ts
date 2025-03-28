import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

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

  // Getter for skills FormArray
  get skillsControls() {
    return (this.jobApplicationForm.get('skills') as FormArray).controls;
  }

  // Getter for firstName
  get firstName() {
    return this.jobApplicationForm.get('firstName') ?? this.fb.control('');
  }

  // Getter for lastName
  get lastName() {
    return this.jobApplicationForm.get('lastName') ?? this.fb.control('');
  }

  // Add a new skill to the skills FormArray
  addSkill() {
    const skillsArray = this.jobApplicationForm.get('skills') as FormArray;
    skillsArray.push(this.fb.control('', Validators.required));
  }

  // Remove a skill from the skills FormArray
  removeSkill(index: number) {
    const skillsArray = this.jobApplicationForm.get('skills') as FormArray;
    skillsArray.removeAt(index);
  }

  // Custom async validator to check if name exists
  nameExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{[key: string]: any} | null> => {
      // Simulated database check
      return this.checkNameExists(control.value).pipe(
        map(exists => exists ? { nameExists: true } : null)
      );
    };
  }

  // Simulated database check method
  checkNameExists(name: string): Observable<boolean> {
    // Simulating an API call with a predefined list of existing names
    const existingNames = ['John', 'Jane', 'Doe', 'Smith'];
    
    return of(existingNames.includes(name)).pipe(
      // network delay
      delay(1000)
    );
  }

  // Form submission handler
  onSubmit() {
    if (this.jobApplicationForm.valid) {
      console.log(this.jobApplicationForm.value);
      // submission logic 
    }
  }
}