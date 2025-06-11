import { DatePipe, JsonPipe, LowerCasePipe, NgFor, UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NaPipe } from '../pipes/na.pipe';
import { ProgressbarComponent } from "../reusable/progressbar/progressbar.component";

@Component({
  selector: 'app-ng-for',
  imports: [FormsModule, NgFor, UpperCasePipe, LowerCasePipe, JsonPipe, DatePipe, NaPipe, ProgressbarComponent],
  templateUrl: './ng-for.component.html',
  styleUrl: './ng-for.component.css'
})
export class NgForComponent {
  courseName: string= "Angular";
  currentDate: Date= new Date();
  studentObj: any={
    name: "Kyalo",
    city: "Pune",
    mobile: '1122334455'
  }
  cityList: string[]=["Pune", "Nagpur","Jaipur","Mumbai","Thune"]
  employeeArray: any[]=[
    {empId: 121, name:'AAA', city:'', contactNo:'111111', attendance: 90},
    {empId: 122, name:'BBB', city:'Nagpur', contactNo:'222222', attendance: 30},
    {empId: 123, name:'CCC', city:'Jaipur', contactNo:'333333', attendance: 70},
    {empId: 124, name:'DDD', city:'Mumbai', contactNo:'444444', attendance: 25},
    {empId: 125, name:null, city:'Thune', contactNo:'555555', attendance: 92} 
  ]
}
