import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tabs',
  imports: [],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css'
})
export class TabsComponent {
  @Input() tabs: string[] = [];
  @Output() onTabClicked= new EventEmitter<string>();
  onTabChange(tab: string) {
    this.onTabClicked.emit(tab);
  }
}
