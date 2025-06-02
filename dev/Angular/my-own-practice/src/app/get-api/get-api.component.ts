import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-get-api',
  imports: [],
  templateUrl: './get-api.component.html',
  styleUrl: './get-api.component.css'
})
export class GetApiComponent {
  userList: any[] = [];
  constructor(private http: HttpClient){}
  getUsers(){
    this.http.get('https://jsonplaceholder.typicode.com/users').subscribe((res: any)=>{
      this.userList = res;
    })
  }

}
