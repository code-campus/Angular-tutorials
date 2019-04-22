import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivatepageComponent } from './privatepage.component';

describe('PrivatepageComponent', () => {
  let component: PrivatepageComponent;
  let fixture: ComponentFixture<PrivatepageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivatepageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivatepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
