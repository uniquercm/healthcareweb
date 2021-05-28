import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrcellComponent } from './drcell.component';

describe('DrcellComponent', () => {
  let component: DrcellComponent;
  let fixture: ComponentFixture<DrcellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrcellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrcellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
