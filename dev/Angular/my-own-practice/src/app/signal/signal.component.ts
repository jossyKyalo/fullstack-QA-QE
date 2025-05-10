import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-signal',
  imports: [],
  templateUrl: './signal.component.html',
  styleUrl: './signal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalComponent {
  firstName= signal('John');
  lastName= signal('Doe');
  courseName: string= 'Angular';
  rollNo= signal<number>(0);

  constructor() {
    const value = this.firstName();
    setTimeout(() => {
      debugger;
      this.courseName= "React";
      this.firstName.set('Jane');
      debugger;
    }, 5000);
  }

  onIncrement() {
    this.rollNo.update((prev) => prev + 1);
  }
}
