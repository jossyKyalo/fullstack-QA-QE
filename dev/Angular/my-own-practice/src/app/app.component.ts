import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataBindingComponent } from './data-binding/data-binding.component';
import { NgIfComponent } from './ng-if/ng-if.component';
import { NgForComponent } from './ng-for/ng-for.component';
import { NgClassComponent } from "./ng-class/ng-class.component";
import { NgStyleComponent } from "./ng-style/ng-style.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DataBindingComponent, NgIfComponent, NgForComponent, NgClassComponent, NgStyleComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-own-practice';
}
