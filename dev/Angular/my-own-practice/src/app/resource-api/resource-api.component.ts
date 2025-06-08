import { Component, resource } from '@angular/core';
 

@Component({
  selector: 'app-resource-api',
  imports: [ ],
  templateUrl: './resource-api.component.html',
  styleUrl: './resource-api.component.css'
})
export class ResourceApiComponent {
  userList = resource({
    loader: () => {
      return fetch('https://jsonplaceholder.typicode.com/users')
        .then((response) => response.json() as Promise<any[]>)
    }
  })
  realodData(){
    this.userList.reload();
  }

}
