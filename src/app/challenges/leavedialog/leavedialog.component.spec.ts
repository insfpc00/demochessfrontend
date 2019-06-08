import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavedialogComponent } from './leavedialog.component';

describe('LeavedialogComponent', () => {
  let component: LeavedialogComponent;
  let fixture: ComponentFixture<LeavedialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeavedialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeavedialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
