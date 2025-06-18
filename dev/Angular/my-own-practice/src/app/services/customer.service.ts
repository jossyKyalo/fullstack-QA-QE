import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { get } from 'http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  tokenExprired$: Subject<boolean> = new Subject<boolean>();
  tokenReceived$: Subject<boolean> = new Subject<boolean>();
  apiUrl = "https://freeapi.miniprojectideas.com/api/CarRentalApp/";

  constructor(private http: HttpClient) { }
  loadCustomers() {
    return this.http.get(this.apiUrl+"GetCustomers");
  }
  createNewCustomer(obj: any) {
    return this.http.post(this.apiUrl+"CreateNewCustomer", obj);
  }
}
