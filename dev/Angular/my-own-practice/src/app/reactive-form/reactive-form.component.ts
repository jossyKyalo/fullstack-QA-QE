import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reactive-form',
  imports: [ReactiveFormsModule],
  templateUrl: './reactive-form.component.html',
  styleUrl: './reactive-form.component.css'
})
export class ReactiveFormComponent {
  userForm: FormGroup= new FormGroup({
    fName: new FormControl(""),
    lName: new FormControl(""),
    userName: new FormControl(""),
    city: new FormControl(""),
    state: new FormControl("Nairobi"),
    zipCode: new FormControl(),
    isTermsAgreed: new FormControl(false)
  })
  onUserSave(){
    const formValue= this.userForm.value;
    debugger;
  }

}
