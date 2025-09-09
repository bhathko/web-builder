import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewBlockComponent } from './preview-block.component';

describe('PreviewBlockComponent', () => {
  let component: PreviewBlockComponent;
  let fixture: ComponentFixture<PreviewBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewBlockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
