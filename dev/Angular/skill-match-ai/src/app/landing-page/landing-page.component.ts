import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  imports: [CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  testimonials = [
    {
      name: 'Mary Andrew',
      role: 'Intern - Microsoft',
      rating: 5,
      comment: 'SkillMatch AI helped me land my dream job.'
    },
    {
      name: 'John Doe',
      role: 'Senior developer - Safaricom PLC',
      rating: 5,
      comment: 'Through skill-matchai I got recruited as senior dev.'
    }
  ];

}
