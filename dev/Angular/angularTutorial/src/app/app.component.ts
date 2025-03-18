import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',//how component will be used in html
  imports: [RouterOutlet],
  templateUrl: './app.component.html',//points to html file
  styleUrl: './app.component.css'//points to css file
})
export class AppComponent {
  title = 'angularTutorial';
  message: string="Hello World"
}
