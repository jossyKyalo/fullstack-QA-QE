import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-signal',
  imports: [],
  templateUrl: './signal.component.html',
  styleUrl: './signal.component.css'
})
export class SignalComponent {
  firstName= signal('John');
  lastName= signal('Doe');

  constructor() {
    const value = this.firstName();
  }

}
