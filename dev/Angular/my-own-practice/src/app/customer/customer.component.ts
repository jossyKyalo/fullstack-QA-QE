import { CommonModule} from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-customer',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent {
  customerObj: any = {
    "customerId": 0,
    "customerName": "",
    "customerCity": "",
    "mobileNo": "",
    "email": ""
  }
  customerList: any[] = [];
  constructor(private custSrv: CustomerService) {
    this.getCustomers();
  }
  // getCustomers(){
  //   this.http.get("https://freeapi.miniprojectideas.com/api/CarRentalApp/GetCustomers").subscribe((response: any) => {
  //     this.customerList = response.data;
  //   });
  // }

  getCustomers() {
    this.custSrv.loadCustomers().subscribe((response: any) => {
      this.customerList = response.data;
    });
  }
  onSaveCustomer() {
    debugger;
    this.custSrv.createNewCustomer(this.customerObj).subscribe((res: any) => {
      if (res.result) {
        alert("Customer Created Successfully");
        this.getCustomers();
      } else {
        alert("Error Occured while creating customer");
      }
    });
  }
}
