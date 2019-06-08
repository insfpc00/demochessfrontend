import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisboardComponent } from './analysisboard.component';

describe('AnalysisboardComponent', () => {
  let component: AnalysisboardComponent;
  let fixture: ComponentFixture<AnalysisboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalysisboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysisboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
