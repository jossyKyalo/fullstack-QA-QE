 
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink]
})
export class RegisterComponent {
  registerForm: FormGroup;
  userType: string = 'jobSeeker';  
  
  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
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
        ...this.registerForm.value,
        userType: this.userType
      };
      
      console.log('Registration data:', formData);
      
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
  
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}