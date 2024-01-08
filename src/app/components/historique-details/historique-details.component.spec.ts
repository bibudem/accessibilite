import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueDetailsComponent } from './historique-details.component';

describe('HistoriqueDetailsComponent', () => {
  let component: HistoriqueDetailsComponent;
  let fixture: ComponentFixture<HistoriqueDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoriqueDetailsComponent]
    });
    fixture = TestBed.createComponent(HistoriqueDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
