import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      full_name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
      return null;
    }
  }

  setUserType(type: string): void {
    this.userType = type;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formData = {
        email: this.registerForm.value.email,
        full_name: this.registerForm.value.full_name,
        password: this.registerForm.value.password,
        user_type: this.userType // e.g., 'job_seeker'
      };

      this.http.post('http://localhost:4000/api/auth/register', formData, { withCredentials: true })
        .subscribe({
          next: (res: any) => {
            console.log('✅ Registration successful:', res);
            if (this.userType === 'job_seeker') {
              // Redirect job seekers to onboarding
              this.router.navigate(['/onboarding']);
            } else {
              // Redirect recruiters or admins to login (or another route)
              this.router.navigate(['/login']);
            }
          },
          error: (err) => {
            console.error('❌ Registration failed:', err);
            this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
          }
        });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}