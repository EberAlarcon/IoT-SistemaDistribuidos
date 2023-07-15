import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimeRealPage } from './time-real.page';

describe('TimeRealPage', () => {
  let component: TimeRealPage;
  let fixture: ComponentFixture<TimeRealPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TimeRealPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
