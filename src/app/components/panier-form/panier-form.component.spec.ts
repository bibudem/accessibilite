import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanierFormComponent } from './panier-form.component';

describe('PanierFormComponent', () => {
  let component: PanierFormComponent;
  let fixture: ComponentFixture<PanierFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PanierFormComponent]
    });
    fixture = TestBed.createComponent(PanierFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
