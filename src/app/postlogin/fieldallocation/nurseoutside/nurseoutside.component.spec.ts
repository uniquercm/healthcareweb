import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NurseoutsideComponent } from './nurseoutside.component';

describe('NurseoutsideComponent', () => {
  let component: NurseoutsideComponent;
  let fixture: ComponentFixture<NurseoutsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NurseoutsideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NurseoutsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
