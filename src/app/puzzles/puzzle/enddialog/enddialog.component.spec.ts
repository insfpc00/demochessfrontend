import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnddialogComponent } from './enddialog.component';

describe('EnddialogComponent', () => {
  let component: EnddialogComponent;
  let fixture: ComponentFixture<EnddialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnddialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnddialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
