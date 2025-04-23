import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink]
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string | null = null;
  
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;

      this.userService.login(credentials).subscribe({
        next: (res) => {
          const userType = res?.user?.user_type;

          switch (userType) {
            case 'admin':
              this.router.navigate(['/users']);
              break;
            case 'job_seeker':
              this.router.navigate(['/onboarding']);
              break;
            case 'recruiter':
              this.router.navigate(['/recruiter']);
              break;
            default:
              this.router.navigate(['/']);
          }
        },
        error: (err) => {
          console.error('Login error:', err);
          this.loginError = 'Invalid email or password. Please try again.';
        }
      });

    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  navigateToSignUp(): void {
    this.router.navigate(['/signup']);
  }

  forgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
}