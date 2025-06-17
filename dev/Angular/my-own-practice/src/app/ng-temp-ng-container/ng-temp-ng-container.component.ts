import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-ng-temp-ng-container',
  imports: [CommonModule],
  templateUrl: './ng-temp-ng-container.component.html',
  styleUrl: './ng-temp-ng-container.component.css'
})
export class NgTempNgContainerComponent {
  employeeArray: any[]=[
    {empId: 121, name:'AAA', city:'', contactNo:'111111', attendance: 90},
    {empId: 122, name:'BBB', city:'Nagpur', contactNo:'222222', attendance: 30},
    {empId: 123, name:'CCC', city:'Jaipur', contactNo:'333333', attendance: 70},
    {empId: 124, name:'DDD', city:'Mumbai', contactNo:'444444', attendance: 25},
    {empId: 125, name:null, city:'Thune', contactNo:'555555', attendance: 92} 
  ]

}
