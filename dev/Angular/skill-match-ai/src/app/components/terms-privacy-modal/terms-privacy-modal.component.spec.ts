import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsPrivacyModalComponent } from './terms-privacy-modal.component';

describe('TermsPrivacyModalComponent', () => {
  let component: TermsPrivacyModalComponent;
  let fixture: ComponentFixture<TermsPrivacyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermsPrivacyModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermsPrivacyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
