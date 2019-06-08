import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconwrapperComponent } from './iconwrapper.component';

describe('IconwrapperComponent', () => {
  let component: IconwrapperComponent;
  let fixture: ComponentFixture<IconwrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconwrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconwrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
