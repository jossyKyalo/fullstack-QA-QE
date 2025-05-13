import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { zip } from 'rxjs';

@Component({
  selector: 'app-template-form',
  imports: [FormsModule, CommonModule, NgIf],
  templateUrl: './template-form.component.html',
  styleUrl: './template-form.component.css'
})
export class TemplateFormComponent {
  userObj: any={
    firstName: '',
    lastName: '',
    userName: '',
    city: '',
    state: 'Nairobi',
    zipCode: '',
    isTermsAgreed: false
  }
  onSave(){
    debugger;
    const formValue= this.userObj;

  }

}
