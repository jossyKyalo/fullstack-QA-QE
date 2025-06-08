import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-life-cycle',
  imports: [],
  templateUrl: './life-cycle.component.html',
  styleUrl: './life-cycle.component.css'
})
export class LifeCycleComponent implements OnInit, AfterViewInit, AfterViewChecked, AfterContentInit, AfterContentChecked, OnDestroy {
  constructor() {
    console.log("Constructor called");
  }
  ngOnInit(): void {
    console.log("ngOnInit called");
  }
  ngAfterContentInit(): void {
    console.log("ngAfterContentInit called");
  }
  ngAfterContentChecked(): void {
    console.log("ngAfterContentChecked called");
  }
  ngAfterViewInit(): void {
    console.log("ngAfterViewInit called");
  }
  ngAfterViewChecked(): void {
    console.log("ngAfterViewChecked called");
  }
  ngOnDestroy(): void {
    console.log("ngOnDestroy called");
  }
}
