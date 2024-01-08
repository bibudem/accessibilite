import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkRecuperationComponent } from './link-recuperation.component';

describe('LinkRecuperationComponent', () => {
  let component: LinkRecuperationComponent;
  let fixture: ComponentFixture<LinkRecuperationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkRecuperationComponent]
    });
    fixture = TestBed.createComponent(LinkRecuperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
