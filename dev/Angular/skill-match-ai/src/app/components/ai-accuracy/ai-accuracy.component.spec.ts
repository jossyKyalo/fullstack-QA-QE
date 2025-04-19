import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiAccuracyComponent } from './ai-accuracy.component';

describe('AiAccuracyComponent', () => {
  let component: AiAccuracyComponent;
  let fixture: ComponentFixture<AiAccuracyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiAccuracyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiAccuracyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
