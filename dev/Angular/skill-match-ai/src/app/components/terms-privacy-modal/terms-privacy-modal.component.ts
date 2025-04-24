import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms-privacy-modal',
  imports:[CommonModule],
  standalone: true,
  templateUrl: './terms-privacy-modal.component.html',
  styleUrls: ['./terms-privacy-modal.component.css'],
  animations: [
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class TermsPrivacyModalComponent {
  @Input() showModal = false;
  @Input() modalType: 'terms' | 'privacy' = 'terms';
  @Output() closeModal = new EventEmitter<void>();

  onClose() {
    this.closeModal.emit();
  }

   
  preventClose(event: Event) {
    event.stopPropagation();
  }

  getTitle(): string {
    return this.modalType === 'terms' ? 'Terms of Service' : 'Privacy Policy';
  }
}
