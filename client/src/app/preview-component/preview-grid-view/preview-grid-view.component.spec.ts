import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewGridViewComponent } from './preview-grid-view.component';

describe('PreviewGridViewComponent', () => {
  let component: PreviewGridViewComponent;
  let fixture: ComponentFixture<PreviewGridViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewGridViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
