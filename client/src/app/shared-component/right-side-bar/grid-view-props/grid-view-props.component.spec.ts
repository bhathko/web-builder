import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridViewPropsComponent } from './grid-view-props.component';

describe('GridViewPropsComponent', () => {
  let component: GridViewPropsComponent;
  let fixture: ComponentFixture<GridViewPropsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridViewPropsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridViewPropsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
