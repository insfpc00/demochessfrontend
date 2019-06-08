import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicboardComponent } from './basicboard.component';

describe('BasicboardComponent', () => {
  let component: BasicboardComponent;
  let fixture: ComponentFixture<BasicboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
