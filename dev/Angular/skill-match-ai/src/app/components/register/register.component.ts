import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user.service'; 
import { AbstractControlOptions } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink]
})
export class RegisterComponent {
  registerForm: FormGroup;
  userType: string = 'job_seeker';
  errorMessage: string | null = null; // To display registration errors
                         

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      full_name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      user_type: [this.userType]
    },
     {
      validators: this.passwordMatchValidator as AbstractControlOptions['validators']
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.controls['password'].value;
    const confirmPassword = group.controls['confirmPassword'].value;
    return password === confirmPassword ? null : { notMatching: true };
  }

  setUserType(type: string): void {
    this.userType = type;
    this.registerForm.patchValue({ user_type: type });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const userData = this.registerForm.value;
      this.userService.createUser(userData).then(
        (response: any) => {
          console.log('Registration successful:', response);
          this.router.navigate(['/login']);
        })
        .catch((error) => {
          console.error('Registration failed:', error);
          this.errorMessage = error.error.message || 'Registration failed. Please try again.';
        }
      );
    } else {
      this.errorMessage = 'Please fill out all required fields correctly.';
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}