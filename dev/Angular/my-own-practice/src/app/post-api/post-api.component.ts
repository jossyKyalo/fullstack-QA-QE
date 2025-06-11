import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { TabsComponent } from "../reusable/tabs/tabs.component";
import { Car, ICarList } from '../model/car';

@Component({
  selector: 'app-post-api',
  imports: [TabsComponent],
  templateUrl: './post-api.component.html',
  styleUrl: './post-api.component.css'
})
export class PostApiComponent {
  carList: ICarList[] = [];
  carObj:  Car= new Car();
  http = inject(HttpClient);
  onTabChange(tab: string) {
    console.log("Tab changed to: " + tab);
  }
  getAllCars() {
    this.http.get('https://freeapi.miniprojectideas.com/api/CarRentalApp/GetCars').subscribe((res: any) => {
      this.carList = res.data;
    })
  }
  onSaveCar() {
    this.http.post('https://freeapi.miniprojectideas.com/api/CarRentalApp/CreateNewCar', this.carObj).subscribe((res: any) => {
      if (res.status == 200) {
        alert("Car added successfully");
        this.getAllCars();
        this.carObj = new Car();  
      } else {
        alert("Error adding car");
      }
    }, (err) => {
      console.error(err);
      alert("An error occurred while adding the car");
    });
  }

}
