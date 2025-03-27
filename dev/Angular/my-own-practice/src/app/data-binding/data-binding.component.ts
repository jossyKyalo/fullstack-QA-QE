import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
@Component({
  selector: 'app-data-binding',
  imports: [FormsModule],
  templateUrl: './data-binding.component.html',
  styleUrl: './data-binding.component.css'
})
export class DataBindingComponent {
  firstName: string="Jossy";
  rollNo: number=121;
  isActive: boolean=true;
  currentDate: Date= new Date();
  myPlaceholder: string= "Enter full Name";
  div1ClassName: string= "bg-primary";
  selectedCity: string="";

  constructor(){
    console.log(this.firstName)

    this.isActive= false;
    console.log(this.isActive);
  }
  showWelcomeMessage(){
    alert("i love you <3")
  }
  onCityChange(){
    console.log("City Changed")
  }
}
