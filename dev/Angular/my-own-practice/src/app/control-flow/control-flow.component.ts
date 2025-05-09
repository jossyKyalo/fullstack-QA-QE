import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-control-flow',
  imports: [CommonModule, FormsModule],
  templateUrl: './control-flow.component.html',
  styleUrl: './control-flow.component.css'
})
export class ControlFlowComponent {
  div1Visible: boolean = true;
  isChecked: boolean = false;
  dayName: string = '';

  cityList: string[] = [
    'New York',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Phoenix',
    'Philadelphia',
    'San Antonio',
    'San Diego',
    'Dallas',
    'San Jose'
  ]
  employeeArray: any[]=[
    {empId: 121, name:'AAA', city:'Pune', contactNo:'111111'},
    {empId: 122, name:'BBB', city:'Nagpur', contactNo:'222222'},
    {empId: 123, name:'CCC', city:'Jaipur', contactNo:'333333'},
    {empId: 124, name:'DDD', city:'Mumbai', contactNo:'444444'},
    {empId: 125, name:'EEE', city:'Thune', contactNo:'555555'} 
  ]

  hideShowDiv1(isShow: boolean) {
    this.div1Visible = isShow;
  }
}
