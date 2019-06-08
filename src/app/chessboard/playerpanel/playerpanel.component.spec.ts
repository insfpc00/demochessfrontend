import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerpanelComponent } from './playerpanel.component';

describe('PlayerpanelComponent', () => {
  let component: PlayerpanelComponent;
  let fixture: ComponentFixture<PlayerpanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerpanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
