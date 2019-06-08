import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeschartComponent } from './challengeschart.component';

describe('ChallengeschartComponent', () => {
  let component: ChallengeschartComponent;
  let fixture: ComponentFixture<ChallengeschartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChallengeschartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeschartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
