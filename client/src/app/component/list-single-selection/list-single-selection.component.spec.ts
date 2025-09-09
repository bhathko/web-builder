import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSingleSelectionComponent } from './list-single-selection.component';

describe('ListSingleSelectionComponent', () => {
  let component: ListSingleSelectionComponent;
  let fixture: ComponentFixture<ListSingleSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListSingleSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSingleSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
