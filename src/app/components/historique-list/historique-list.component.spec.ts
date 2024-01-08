import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueListComponent } from './historique-list.component';

describe('HistoriqueListComponent', () => {
  let component: HistoriqueListComponent;
  let fixture: ComponentFixture<HistoriqueListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoriqueListComponent]
    });
    fixture = TestBed.createComponent(HistoriqueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
