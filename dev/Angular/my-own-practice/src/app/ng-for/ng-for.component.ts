import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ng-for',
  imports: [FormsModule, NgFor],
  templateUrl: './ng-for.component.html',
  styleUrl: './ng-for.component.css'
})
export class NgForComponent {
  cityList: string[]=["Pune", "Nagpur","Jaipur","Mumbai","Thune"]
  employeeArray: any[]=[
    {empId: 121, name:'AAA', city:'Pune', contactNo:'111111'},
    {empId: 122, name:'BBB', city:'Nagpur', contactNo:'222222'},
    {empId: 123, name:'CCC', city:'Jaipur', contactNo:'333333'},
    {empId: 124, name:'DDD', city:'Mumbai', contactNo:'444444'},
    {empId: 125, name:'EEE', city:'Thune', contactNo:'555555'} 
  ]
}
