import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'skill-match-ai';
  constructor(private router: Router) {}

  ngOnInit() {
    // Check token validity every minute
    interval(60000).subscribe(() => {
      this.checkTokenValidity();
    });

    // Also check on app initialization
    this.checkTokenValidity();
  }

  checkTokenValidity() {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      console.log('No token found');
      this.router.navigate(['/login']);
      return;
    }

    try {
      // Decode token payload (second part of JWT)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      
      if (Date.now() >= expirationTime) {
        console.log('Token expired');
        alert('Your session has expired. Please log in again.');
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Error parsing token:', error);
      this.router.navigate(['/login']);
    }
  }
}
