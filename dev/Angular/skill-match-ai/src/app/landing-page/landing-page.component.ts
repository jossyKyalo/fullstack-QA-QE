import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {trigger,transition,style, animate,state} from '@angular/animations';

@Component({
  selector: 'app-landing-page',
  imports: [CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
  // animations: [
  //   trigger('slideAnimation', [
  //     transition(':enter', [
  //       style({ transform: 'translateX(100%)', opacity: 0 }),
  //       animate('600ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
  //     ]),
  //     transition(':leave', [
  //       animate('600ms ease-in', style({ transform: 'translateX(-100%)', opacity: 0 }))
  //     ])
  //   ])
  // ]
})

export class LandingPageComponent implements OnInit{
  currentIndex: number = 0;

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
    },
    {
      name: 'Asiya Juma',
      role: 'UI/UX - Safaricom PLC',
      rating: 5,
      comment: 'SkillMatch is the best!. I can\'t imagine my life without it.'
    },
    {
      name: 'Darling Chipo',
      role: 'Scrum master - The Jitu',
      rating: 5,
      comment: 'Through skill-match.ai I landed a scrum master role at The Jitu.'
    },

    {
      names: 'Josephine',
      role: 'ML lead - Microsoft',
      rating: 4,
      comment: 'I got to practice the same interview questions I was asked.'
    },
    {
      name: 'John Smith',
      role: 'Project Manager- Bidco',
      rating: 4,
      comment: 'Very intuitive and fast matchmaking process.'
    }
  ];
  ngOnInit(): void {
    setInterval(() => this.nextSlide(), 4000);
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
  }
}
